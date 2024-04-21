package dotnet

import (
	"context"
	"errors"
	"fmt"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/internal/core/node"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/dotnet/frameworks/dotnet-clean-architecture"
	"github.com/intelops/compage/internal/languages/dotnet/integrations/docker"
	"github.com/intelops/compage/internal/languages/dotnet/integrations/githubactions"
	"github.com/intelops/compage/internal/languages/dotnet/integrations/kubernetes"
	"github.com/intelops/compage/internal/languages/dotnet/integrations/license"
	"github.com/intelops/compage/internal/languages/templates"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"strings"
)

// Generate generates dotnet specific code according to config passed
func Generate(ctx context.Context) error {
	// extract goNode
	goValues := ctx.Value(contextKeyDotNetContextVars).(DotNetValues)
	// rest config
	err := generateRESTConfig(ctx, &goValues)
	if err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// integrations config
	err = generateIntegrationConfig(&goValues)
	if err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}

func generateRESTConfig(_ context.Context, dotNetValues *DotNetValues) error {
	n := dotNetValues.LDotNetLangNode
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Template == templates.Compage {
			if n.RestConfig.Framework == NetCleanArchitectureFramework {
				dotNetCleanArchitectureCopier, err := getDotNetCleanArchitectureCopier(dotNetValues)
				if err != nil {
					log.Errorf("error while getting the dotnet clean architecture framework copier [" + err.Error() + "]")
					return err
				}
				if n.RestConfig.Server != nil {
					if err := dotNetCleanArchitectureCopier.CreateRestServer(); err != nil {
						log.Errorf("err : %s", err)
						return err
					}
				}
			} else {
				return fmt.Errorf("unsupported framework %s for template %s for language %s", n.RestConfig.Framework, n.RestConfig.Template, n.Language)
			}
		}
	}

	return nil
}

func getDotNetCleanArchitectureCopier(dotNetValues *DotNetValues) (*dotnetcleanarchitecture.Copier, error) {
	dotNetTemplatesRootPath := GetDotNetTemplatesRootPath(dotNetValues.Values.CompageCoreVersion)
	if dotNetTemplatesRootPath == "" {
		return nil, errors.New("dotnet templates root path is empty")
	}
	path := dotNetTemplatesRootPath + "/frameworks/" + NetCleanArchitectureFramework

	gitPlatformURL := dotNetValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := dotNetValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := dotNetValues.Values.Get(languages.GitRepositoryName)
	// dotnet nodes usually have a directory name same as node name itself but in caps.
	nodeName := dotNetValues.Values.Get(languages.NodeName)
	nodeDirectoryName := strings.Replace(dotNetValues.Values.NodeDirectoryName, nodeName, strcase.ToCamel(nodeName), 1)
	isRestServer := dotNetValues.LDotNetLangNode.RestConfig != nil && dotNetValues.LDotNetLangNode.RestConfig.Server != nil
	var restServerPort string
	var restSQLDB string
	var isRestSQLDB bool
	var restNoSQLDB string
	var isRestNoSQLDB bool
	var restResources []*corenode.Resource
	if isRestServer {
		restServerPort = dotNetValues.LDotNetLangNode.RestConfig.Server.Port
		restResources = dotNetValues.LDotNetLangNode.RestConfig.Server.Resources
		isRestSQLDB = dotNetValues.LDotNetLangNode.RestConfig.Server.SQLDB != ""
		restSQLDB = dotNetValues.LDotNetLangNode.RestConfig.Server.SQLDB
		isRestNoSQLDB = dotNetValues.LDotNetLangNode.RestConfig.Server.NoSQLDB != ""
		restNoSQLDB = dotNetValues.LDotNetLangNode.RestConfig.Server.NoSQLDB
	} else {
		restServerPort = ""
		isRestSQLDB = false
		restSQLDB = ""
		isRestNoSQLDB = false
		restNoSQLDB = ""
		restResources = []*corenode.Resource{}
	}

	restClients := dotNetValues.LDotNetLangNode.RestConfig.Clients
	// create golang specific copier
	copier := dotnetcleanarchitecture.NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, isRestSQLDB, restSQLDB, isRestNoSQLDB, restNoSQLDB, restResources, restClients)

	return copier, nil
}

func generateIntegrationConfig(dotNetValues *DotNetValues) error {
	m, err := getIntegrationsCopier(dotNetValues)
	if err != nil {
		log.Errorf("error while getting the integrations copier [" + err.Error() + "]")
		return err
	}

	// license files need to be generated for the whole project so, it should be here.
	licenseCopier := m["license"].(*license.Copier)
	if err = licenseCopier.CreateLicenseFiles(); err != nil {
		log.Errorf("err : %s", err)
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

	return nil
}

func getIntegrationsCopier(dotNetValues *DotNetValues) (map[string]interface{}, error) {
	dotNetTemplatesRootPath := GetDotNetTemplatesRootPath(dotNetValues.Values.CompageCoreVersion)
	if dotNetTemplatesRootPath == "" {
		return nil, errors.New("dotnet templates root path is empty")
	}

	gitPlatformUserName := dotNetValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := dotNetValues.Values.Get(languages.GitRepositoryName)
	nodeName := dotNetValues.Values.Get(languages.NodeName)
	// dotnet nodes usually have a directory name same as node name itself but in caps.
	nodeDirectoryName := strings.Replace(dotNetValues.Values.NodeDirectoryName, nodeName, strcase.ToCamel(nodeName), 1)
	projectDirectoryName := utils.GetProjectDirectoryName(dotNetValues.Values.ProjectName)

	// rest
	isRestServer := dotNetValues.LDotNetLangNode.RestConfig != nil && dotNetValues.LDotNetLangNode.RestConfig.Server != nil
	var restServerPort string
	if isRestServer {
		restServerPort = dotNetValues.LDotNetLangNode.RestConfig.Server.Port
	} else {
		restServerPort = ""
	}

	// create dotnet specific licenseCopier
	licenseCopier := license.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, dotNetTemplatesRootPath, dotNetValues.LDotNetLangNode.Metadata)

	// create dotnet specific dockerCopier
	dockerCopier := docker.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, dotNetTemplatesRootPath, isRestServer, restServerPort)

	// create dotnet specific k8sCopier
	k8sCopier := kubernetes.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, dotNetTemplatesRootPath, isRestServer, restServerPort)

	// create dotnet specific githubActionsCopier
	githubActionsCopier := githubactions.NewCopier(gitPlatformUserName, gitRepositoryName, projectDirectoryName, nodeName, nodeDirectoryName, dotNetTemplatesRootPath)

	return map[string]interface{}{
		"docker":        dockerCopier,
		"k8s":           k8sCopier,
		"githubActions": githubActionsCopier,
		"license":       licenseCopier,
	}, nil
}
