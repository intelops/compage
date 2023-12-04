package dotnet

import (
	"context"
	"errors"
	"fmt"
	corenode "github.com/intelops/compage/internal/core/node"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/dotnet/frameworks/dotnet-clean-architecture"
	"github.com/intelops/compage/internal/languages/templates"
	log "github.com/sirupsen/logrus"
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
				// copy all files at root level, fire this at last
				if err := dotNetCleanArchitectureCopier.CreateRootLevelFiles(); err != nil {
					log.Errorf("err : %s", err)
					return err
				}
			} else {
				return fmt.Errorf("unsupported framework %s for template %s for language %s", n.RestConfig.Framework, n.RestConfig.Template, n.Language)
			}
		}
	}

	return nil
}

func getDotNetCleanArchitectureCopier(dotNetValues *DotNetValues) (*dotnetcleanarchitecture.Copier, error) {
	dotNetTemplatesRootPath := GetDotNetTemplatesRootPath()
	if dotNetTemplatesRootPath == "" {
		return nil, errors.New("dotnet templates root path is empty")
	}
	path := dotNetTemplatesRootPath + "/frameworks/" + NetCleanArchitectureFramework

	gitPlatformURL := dotNetValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := dotNetValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := dotNetValues.Values.Get(languages.GitRepositoryName)
	nodeName := dotNetValues.Values.Get(languages.NodeName)
	nodeDirectoryName := dotNetValues.Values.NodeDirectoryName

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
