package golang

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages"
	common_files "github.com/intelops/compage/core/internal/languages/golang/frameworks/common-files"
	goginserver "github.com/intelops/compage/core/internal/languages/golang/frameworks/go-gin-server"
	gogrpcserver "github.com/intelops/compage/core/internal/languages/golang/frameworks/go-grpc-server"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/devcontainer"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/devspace"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/docker"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/githubactions"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	"github.com/intelops/compage/core/internal/utils"
	log "github.com/sirupsen/logrus"
)

// Generate generates golang specific code according to config passed
func Generate(ctx context.Context) error {
	// extract goNode
	goValues := ctx.Value(contextKeyGoContextVars).(GoValues)
	n := goValues.LGoLangNode
	// rest config
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Server.Template == templates.Compage {
			if n.RestConfig.Server.Framework == GoGinServerFramework {
				goGinServerCopier := getGoGinServerCopier(goValues)
				if err := goGinServerCopier.CreateRestConfigs(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
				// copy all files at root level, fire this at last
				if err := goGinServerCopier.CreateRootLevelFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
			} else {
				return fmt.Errorf("unsupported framework %s  for template %s for language %s", n.RestConfig.Server.Framework, n.RestConfig.Server.Template, n.Language)
			}
		} else {
			if n.RestConfig.Server.Template != templates.OpenAPI {
				// call openapi generator
				return fmt.Errorf("unsupported template %s for language %s", n.RestConfig.Server.Template, n.Language)
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
	// grpc config
	if n.GrpcConfig != nil {
		// check for the templates
		if n.GrpcConfig.Server.Template == templates.Compage {
			if n.GrpcConfig.Server.Framework == GoGrpcServerFramework {
				goGrpcServerCopier := getGoGrpcServerCopier(goValues)
				if err := goGrpcServerCopier.CreateGrpcConfigs(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
				// copy all files at root level, fire this at last
				if err := goGrpcServerCopier.CreateRootLevelFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
			} else {
				return fmt.Errorf("unsupported framework %s  for template %s for language %s", n.GrpcConfig.Server.Framework, n.GrpcConfig.Server.Template, n.Language)
			}
		} else {
			return fmt.Errorf("unsupported template %s for language %s", n.GrpcConfig.Server.Template, n.Language)
		}
	}

	// ws config
	if n.WsConfig != nil {
		return fmt.Errorf("unsupported protocol %s for language %s", "ws", n.Language)
	}

	// common files needs to be generated for the project(custom template for rest and grpc) so, it should be here.
	if (n.RestConfig != nil && n.RestConfig.Server != nil && n.RestConfig.Server.Template == templates.Compage) || (n.GrpcConfig != nil && n.GrpcConfig.Server != nil && n.GrpcConfig.Server.Template == templates.Compage) {
		commonFilesCopier := getCommonFilesCopier(goValues)
		if err := commonFilesCopier.CreateCommonFiles(); err != nil {
			log.Debugf("err : %s", err)
			return err
		}
	}

	m := getIntegrationsCopier(goValues)
	// dockerfile needs to be generated for the whole project so, it should be here.
	dockerCopier := m["docker"].(*docker.Copier)
	if err := dockerCopier.CreateDockerFile(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// k8s files need to be generated for the whole project so, it should be here.
	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err := k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// githubActions files need to be generated for the whole project so, it should be here.
	githubActionsCopier := m["githubActions"].(*githubactions.Copier)
	if err := githubActionsCopier.CreateYamls(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// devspace.yaml and devspace_start.sh need to be generated for the whole project so, it should be here.
	devspaceCopier := m["devspace"].(*devspace.Copier)
	if err := devspaceCopier.CreateDevspaceConfigs(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// devcontainer.json and Dockerfile need to be generated for the whole project so, it should be here.
	devContainerCopier := m["devcontainer"].(*devcontainer.Copier)
	if err := devContainerCopier.CreateDevContainerConfigs(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getCommonFilesCopier(goValues GoValues) *common_files.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	path := GetGoTemplatesRootPath() + "/frameworks/" + CommonFiles

	// rest
	isRestServer := goValues.LGoLangNode.RestConfig != nil && goValues.LGoLangNode.RestConfig.Server != nil
	var restServerPort string
	var restResources []node.Resource
	var restClients []languages.RestClient
	var isRestSQLDB bool
	var restSqlDB string
	if isRestServer {
		restServerPort = goValues.LGoLangNode.RestConfig.Server.Port
		isRestSQLDB = goValues.LGoLangNode.RestConfig.Server.SQLDB != ""
		restSqlDB = goValues.LGoLangNode.RestConfig.Server.SQLDB
		restResources = goValues.LGoLangNode.RestConfig.Server.Resources
		restClients = goValues.LGoLangNode.RestConfig.Clients
	} else {
		restServerPort = ""
		isRestSQLDB = false
		restSqlDB = ""
		restClients = []languages.RestClient{}
		restResources = []node.Resource{}
	}

	// grpc
	isGrpcServer := goValues.LGoLangNode.GrpcConfig != nil && goValues.LGoLangNode.GrpcConfig.Server != nil
	var grpcServerPort string
	var grpcResources []node.Resource
	var grpcClients []languages.GrpcClient
	var isGrpcSQLDB bool
	var grpcSqlDB string

	if isGrpcServer {
		grpcServerPort = goValues.LGoLangNode.GrpcConfig.Server.Port
		isGrpcSQLDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB != ""
		grpcSqlDB = goValues.LGoLangNode.GrpcConfig.Server.SQLDB
		grpcResources = goValues.LGoLangNode.GrpcConfig.Server.Resources
		grpcClients = goValues.LGoLangNode.GrpcConfig.Clients
	} else {
		grpcServerPort = ""
		isGrpcSQLDB = false
		grpcSqlDB = ""
		grpcClients = []languages.GrpcClient{}
		grpcResources = []node.Resource{}
	}

	// create golang specific commonFilesCopier
	copier := common_files.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort, isRestSQLDB, restSqlDB, isGrpcSQLDB, grpcSqlDB, restResources, grpcResources, restClients, grpcClients)
	return copier
}

func getGoGrpcServerCopier(goValues GoValues) *gogrpcserver.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isGrpcServer := goValues.LGoLangNode.GrpcConfig.Server != nil
	grpcServerPort := goValues.LGoLangNode.GrpcConfig.Server.Port
	resources := goValues.LGoLangNode.GrpcConfig.Server.Resources
	clients := goValues.LGoLangNode.GrpcConfig.Clients
	path := GetGoTemplatesRootPath() + "/frameworks/" + GoGrpcServerFramework
	isSQLDB := goValues.LGoLangNode.GrpcConfig.Server.SQLDB != ""
	sqlDB := goValues.LGoLangNode.GrpcConfig.Server.SQLDB
	// create golang specific copier
	copier := gogrpcserver.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isGrpcServer, grpcServerPort, isSQLDB, sqlDB, resources, clients)
	return copier
}

func getGoGinServerCopier(goValues GoValues) *goginserver.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isRestServer := goValues.LGoLangNode.RestConfig.Server != nil
	restServerPort := goValues.LGoLangNode.RestConfig.Server.Port
	resources := goValues.LGoLangNode.RestConfig.Server.Resources
	clients := goValues.LGoLangNode.RestConfig.Clients
	path := GetGoTemplatesRootPath() + "/frameworks/" + GoGinServerFramework
	isSQLDB := goValues.LGoLangNode.RestConfig.Server.SQLDB != ""
	sqlDB := goValues.LGoLangNode.RestConfig.Server.SQLDB
	// create golang specific copier
	copier := goginserver.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isSQLDB, sqlDB, resources, clients)
	return copier
}

func getIntegrationsCopier(goValues GoValues) map[string]interface{} {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
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

	path := GetGoTemplatesRootPath()
	projectDirectoryName := utils.GetProjectDirectoryName(goValues.Values.ProjectName)
	projectName := goValues.Values.ProjectName

	// create golang specific dockerCopier
	dockerCopier := docker.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific k8sCopier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific githubActionsCopier
	githubActionsCopier := githubactions.NewCopier(userName, repositoryName, projectDirectoryName, nodeName, nodeDirectoryName, path)

	// create golang specific devspaceCopier
	devspaceCopier := devspace.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	// create golang specific devContainerCopier
	devContainerCopier := devcontainer.NewCopier(userName, repositoryName, projectName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isGrpcServer, grpcServerPort)

	return map[string]interface{}{
		"docker":        dockerCopier,
		"k8s":           k8sCopier,
		"githubActions": githubActionsCopier,
		"devspace":      devspaceCopier,
		"devcontainer":  devContainerCopier,
	}
}
