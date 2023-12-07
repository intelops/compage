package golang

import (
	"context"
	"errors"
	"fmt"
	corenode "github.com/intelops/compage/internal/core/node"
	"github.com/intelops/compage/internal/languages"
	commonfiles "github.com/intelops/compage/internal/languages/golang/frameworks/common-files"
	goginserver "github.com/intelops/compage/internal/languages/golang/frameworks/go-gin-server"
	gogrpcserver "github.com/intelops/compage/internal/languages/golang/frameworks/go-grpc-server"
	"github.com/intelops/compage/internal/languages/golang/integrations/devcontainer"
	"github.com/intelops/compage/internal/languages/golang/integrations/devspace"
	"github.com/intelops/compage/internal/languages/golang/integrations/docker"
	"github.com/intelops/compage/internal/languages/golang/integrations/githubactions"
	"github.com/intelops/compage/internal/languages/golang/integrations/kubernetes"
	"github.com/intelops/compage/internal/languages/templates"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// Generate generates golang specific code according to config passed
func Generate(ctx context.Context) error {
	// extract goNode
	goValues := ctx.Value(contextKeyGoContextVars).(GoValues)
	n := goValues.LGoLangNode
	// rest config
	err := generateRESTConfig(ctx, &goValues)
	if err != nil {
		log.Errorf("err : %s", err)
		return err
	}
	// grpc config
	err = generateGRPCConfig(&goValues)
	if err != nil {
		log.Errorf("err : %s", err)
		return err
	}
	// ws config
	if n.WsConfig != nil {
		return fmt.Errorf("unsupported protocol %s for language %s", "ws", n.Language)
	}
	// common files need to be generated for the project (custom template for rest and grpc) so, it should be here.
	if (n.RestConfig != nil && n.RestConfig.Server != nil && n.RestConfig.Template == templates.Compage) || (n.GrpcConfig != nil && n.GrpcConfig.Server != nil && n.GrpcConfig.Template == templates.Compage) {
		commonFilesCopier, err0 := getCommonFilesCopier(goValues)
		if err0 != nil {
			log.Errorf("error while getting the commonFilesCopier [" + err0.Error() + "]")
			return err0
		}
		if err = commonFilesCopier.CreateCommonFiles(); err != nil {
			log.Errorf("err : %s", err)
			return err
		}
	}
	// integrations config
	err = generateIntegrationConfig(&goValues)
	if err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}

func generateIntegrationConfig(goValues *GoValues) error {
	m, err := getIntegrationsCopier(goValues)
	if err != nil {
		log.Errorf("error while getting the integrations copier [" + err.Error() + "]")
		return err
	}
	// dockerfile needs to be generated for the whole project, so it should be here.
	dockerCopier := m["docker"].(*docker.Copier)
	if err = dockerCopier.CreateDockerFile(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// k8s files need to be generated for the whole project, so it should be here.
	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err = k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// githubActions files need to be generated for the whole project so, it should be here.
	githubActionsCopier := m["githubActions"].(*githubactions.Copier)
	if err = githubActionsCopier.CreateYamls(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// devspace.yaml and devspace_start.sh need to be generated for the whole project, so it should be here.
	devspaceCopier := m["devspace"].(*devspace.Copier)
	if err = devspaceCopier.CreateDevspaceConfigs(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// devcontainer.json and Dockerfile need to be generated for the whole project, so it should be here.
	devContainerCopier := m["devcontainer"].(*devcontainer.Copier)
	if err = devContainerCopier.CreateDevContainerConfigs(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}

func generateGRPCConfig(goValues *GoValues) error {
	n := goValues.LGoLangNode
	if n.GrpcConfig != nil {
		// check for the templates
		if n.GrpcConfig.Template == templates.Compage {
			if n.GrpcConfig.Framework == GoGrpcServerFramework {
				goGrpcServerCopier, err := getGoGrpcServerCopier(goValues)
				if err != nil {
					log.Errorf("error while getting the goGrpcServerCopier [" + err.Error() + "]")
					return err
				}
				// copy all files at root level
				if err = goGrpcServerCopier.CreateRootLevelFiles(); err != nil {
					log.Errorf("err : %s", err)
					return err
				}
				if n.GrpcConfig.Server != nil {
					if err = goGrpcServerCopier.CreateGrpcServer(); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
					// generate protoc commands on proto file for the code generated
					if err = RunMakeProto(goValues.Values.NodeDirectoryName); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
				}
				if n.GrpcConfig.Clients != nil {
					//  grpcConfig.clients - present when client config is provided
					if err = goGrpcServerCopier.CreateGrpcClients(); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
				}
			} else {
				return fmt.Errorf("unsupported framework %s  for template %s for language %s", n.GrpcConfig.Framework, n.GrpcConfig.Template, n.Language)
			}
		} else {
			return fmt.Errorf("unsupported template %s for language %s", n.GrpcConfig.Template, n.Language)
		}
	}

	return nil
}

func generateRESTConfig(ctx context.Context, goValues *GoValues) error {
	n := goValues.LGoLangNode

	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Template == templates.Compage {
			if n.RestConfig.Framework == GoGinServerFramework {
				goGinServerCopier, err := getGoGinServerCopier(goValues)
				if err != nil {
					log.Errorf("error while getting the goGinServerCopier [" + err.Error() + "]")
					return err
				}
				if n.RestConfig.Server != nil {
					if err = goGinServerCopier.CreateRestServer(); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
				}
				if n.RestConfig.Clients != nil {
					//  restConfig.clients - present when client config is provided
					if err = goGinServerCopier.CreateRestClients(); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
				}
				// copy all files at root level, fire this at last
				if err = goGinServerCopier.CreateRootLevelFiles(); err != nil {
					log.Errorf("err : %s", err)
					return err
				}
			} else {
				return fmt.Errorf("unsupported framework %s  for template %s for language %s", n.RestConfig.Framework, n.RestConfig.Template, n.Language)
			}
		} else {
			if n.RestConfig.Template != templates.OpenAPI {
				// call openapi generator
				return fmt.Errorf("unsupported template %s for language %s", n.RestConfig.Template, n.Language)
			}
			// check if OpenAPIFileYamlContent contains value.
			if len(n.RestConfig.Server.OpenAPIFileYamlContent) < 1 {
				return errors.New("at least rest-config needs to be provided, OpenAPIFileYamlContent is empty")
			}

			if err := languages.ProcessOpenAPITemplate(ctx); err != nil {
				return err
			}
		}
	}

	return nil
}

func getCommonFilesCopier(goValues GoValues) (*commonfiles.Copier, error) {
	goTemplatesRootPath := GetGoTemplatesRootPath()
	if goTemplatesRootPath == "" {
		return nil, errors.New("go templates root path is empty")
	}
	path := goTemplatesRootPath + "/frameworks/" + CommonFiles

	gitPlatformURL := goValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := goValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := goValues.Values.Get(languages.GitRepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName

	// rest
	isRestServer := goValues.LGoLangNode.RestConfig != nil && goValues.LGoLangNode.RestConfig.Server != nil
	var restServerPort string
	var restResources []*corenode.Resource
	var restClients []*corenode.RestClient
	var isRestSQLDB bool
	var restSQLDB string
	var isRestNoSQLDB bool
	var restNoSQLDB string
	if isRestServer {
		restServerPort = goValues.LGoLangNode.RestConfig.Server.Port
		isRestSQLDB = goValues.LGoLangNode.RestConfig.Server.SQLDB != ""
		restSQLDB = goValues.LGoLangNode.RestConfig.Server.SQLDB
		isRestNoSQLDB = goValues.LGoLangNode.RestConfig.Server.NoSQLDB != ""
		restNoSQLDB = goValues.LGoLangNode.RestConfig.Server.NoSQLDB
		restResources = goValues.LGoLangNode.RestConfig.Server.Resources
		restClients = goValues.LGoLangNode.RestConfig.Clients
	} else {
		restServerPort = ""
		isRestSQLDB = false
		restSQLDB = ""
		isRestNoSQLDB = false
		restNoSQLDB = ""
		restResources = []*corenode.Resource{}
		restClients = []*corenode.RestClient{}
	}
	// grpc
	isGrpcServer := goValues.LGoLangNode.GrpcConfig != nil && goValues.LGoLangNode.GrpcConfig.Server != nil
	var grpcServerPort string
	var grpcResources []*corenode.Resource
	var isGrpcSQLDB bool
	var grpcSQLDB string
	var isGrpcNoSQLDB bool
	var grpcNoSQLDB string
	var grpcClients []*corenode.GrpcClient
	if isGrpcServer {
		grpcServerPort = goValues.LGoLangNode.GrpcConfig.Server.Port
		isGrpcSQLDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB != ""
		grpcSQLDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB
		isGrpcNoSQLDB = goValues.LGoLangNode.GrpcConfig.Server.NoSQLDB != ""
		grpcNoSQLDB = goValues.LGoLangNode.GrpcConfig.Server.NoSQLDB
		grpcResources = goValues.LGoLangNode.GrpcConfig.Server.Resources
		grpcClients = goValues.LGoLangNode.GrpcConfig.Clients
	} else {
		grpcServerPort = ""
		isGrpcSQLDB = false
		grpcSQLDB = ""
		isGrpcNoSQLDB = false
		grpcNoSQLDB = ""
		grpcResources = []*corenode.Resource{}
		grpcClients = []*corenode.GrpcClient{}
	}
	// create golang specific commonFilesCopier
	copier := commonfiles.NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort, isRestSQLDB, restSQLDB, isGrpcSQLDB, grpcSQLDB, isRestNoSQLDB, restNoSQLDB, isGrpcNoSQLDB, grpcNoSQLDB, restResources, grpcResources, restClients, grpcClients)
	return copier, nil
}

func getGoGrpcServerCopier(goValues *GoValues) (*gogrpcserver.Copier, error) {
	goTemplatesRootPath := GetGoTemplatesRootPath()
	if goTemplatesRootPath == "" {
		return nil, errors.New("go templates root path is empty")
	}
	path := goTemplatesRootPath + "/frameworks/" + GoGrpcServerFramework

	//gitPlatformName := goValues.Values.Get(languages.GitPlatformName)
	gitPlatformURL := goValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := goValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := goValues.Values.Get(languages.GitRepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isGrpcServer := goValues.LGoLangNode.GrpcConfig != nil && goValues.LGoLangNode.GrpcConfig.Server != nil
	var grpcServerPort string
	var grpcResources []*corenode.Resource
	var isGrpcSQLDB bool
	var grpcSQLDB string
	var isGrpcNoSQLDB bool
	var grpcNoSQLDB string
	if isGrpcServer {
		grpcServerPort = goValues.LGoLangNode.GrpcConfig.Server.Port
		isGrpcSQLDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB != ""
		grpcSQLDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB
		isGrpcNoSQLDB = goValues.LGoLangNode.GrpcConfig.Server.NoSQLDB != ""
		grpcNoSQLDB = goValues.LGoLangNode.GrpcConfig.Server.NoSQLDB
		grpcResources = goValues.LGoLangNode.GrpcConfig.Server.Resources
	} else {
		grpcServerPort = ""
		isGrpcSQLDB = false
		grpcSQLDB = ""
		isGrpcNoSQLDB = false
		grpcNoSQLDB = ""
		grpcResources = []*corenode.Resource{}
	}

	grpcClients := goValues.LGoLangNode.GrpcConfig.Clients
	// create golang specific copier
	copier := gogrpcserver.NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, path, isGrpcServer, grpcServerPort, isGrpcSQLDB, grpcSQLDB, isGrpcNoSQLDB, grpcNoSQLDB, grpcResources, grpcClients)
	return copier, nil
}

func getGoGinServerCopier(goValues *GoValues) (*goginserver.Copier, error) {
	goTemplatesRootPath := GetGoTemplatesRootPath()
	if goTemplatesRootPath == "" {
		return nil, errors.New("go templates root path is empty")
	}
	path := goTemplatesRootPath + "/frameworks/" + GoGinServerFramework

	gitPlatformURL := goValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := goValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := goValues.Values.Get(languages.GitRepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName

	isRestServer := goValues.LGoLangNode.RestConfig != nil && goValues.LGoLangNode.RestConfig.Server != nil
	var restServerPort string
	var restSQLDB string
	var isRestSQLDB bool
	var restNoSQLDB string
	var isRestNoSQLDB bool
	var restResources []*corenode.Resource
	if isRestServer {
		restServerPort = goValues.LGoLangNode.RestConfig.Server.Port
		restResources = goValues.LGoLangNode.RestConfig.Server.Resources
		isRestSQLDB = goValues.LGoLangNode.RestConfig.Server.SQLDB != ""
		restSQLDB = goValues.LGoLangNode.RestConfig.Server.SQLDB
		isRestNoSQLDB = goValues.LGoLangNode.RestConfig.Server.NoSQLDB != ""
		restNoSQLDB = goValues.LGoLangNode.RestConfig.Server.NoSQLDB
	} else {
		restServerPort = ""
		isRestSQLDB = false
		restSQLDB = ""
		isRestNoSQLDB = false
		restNoSQLDB = ""
		restResources = []*corenode.Resource{}
	}

	restClients := goValues.LGoLangNode.RestConfig.Clients
	// create golang specific copier
	copier := goginserver.NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isRestSQLDB, restSQLDB, isRestNoSQLDB, restNoSQLDB, restResources, restClients)
	return copier, nil
}

func getIntegrationsCopier(goValues *GoValues) (map[string]interface{}, error) {
	goTemplatesRootPath := GetGoTemplatesRootPath()
	if goTemplatesRootPath == "" {
		return nil, errors.New("go templates root path is empty")
	}

	gitPlatformUserName := goValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := goValues.Values.Get(languages.GitRepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	// rest
	isRestServer := goValues.LGoLangNode.RestConfig != nil && goValues.LGoLangNode.RestConfig.Server != nil
	var restServerPort string
	if isRestServer {
		restServerPort = goValues.LGoLangNode.RestConfig.Server.Port
	} else {
		restServerPort = ""
	}

	// grpc
	isGrpcServer := goValues.LGoLangNode.GrpcConfig != nil && goValues.LGoLangNode.GrpcConfig.Server != nil
	var grpcServerPort string
	if isGrpcServer {
		grpcServerPort = goValues.LGoLangNode.GrpcConfig.Server.Port
	} else {
		grpcServerPort = ""
	}

	projectDirectoryName := utils.GetProjectDirectoryName(goValues.Values.ProjectName)
	projectName := goValues.Values.ProjectName

	// create golang specific dockerCopier
	dockerCopier := docker.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific k8sCopier
	k8sCopier := kubernetes.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific githubActionsCopier
	githubActionsCopier := githubactions.NewCopier(gitPlatformUserName, gitRepositoryName, projectDirectoryName, nodeName, nodeDirectoryName, goTemplatesRootPath)

	// create golang specific devspaceCopier
	devspaceCopier := devspace.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific devContainerCopier
	devContainerCopier := devcontainer.NewCopier(gitPlatformUserName, gitRepositoryName, projectName, nodeName, nodeDirectoryName, goTemplatesRootPath, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	return map[string]interface{}{
		"docker":        dockerCopier,
		"k8s":           k8sCopier,
		"githubActions": githubActionsCopier,
		"devspace":      devspaceCopier,
		"devcontainer":  devContainerCopier,
	}, nil
}
