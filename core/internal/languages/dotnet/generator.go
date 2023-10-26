package dotnet

import (
	"context"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	dotnetmvcframework "github.com/intelops/compage/core/internal/languages/dotnet/frameworks/dotnet-mvc-framework"
	"github.com/intelops/compage/core/internal/languages/templates"
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

func generateRESTConfig(ctx context.Context, dotNetValues *DotNetValues) error {
	n := dotNetValues.LDotNetLangNode
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Template == templates.Compage {
			if n.RestConfig.Framework == NetMVCFramework {
				dotNetMVCFrameworkCopier := getDotNetMVCFrameworkCopier(dotNetValues)
				if n.RestConfig.Server != nil {
					if err := dotNetMVCFrameworkCopier.CreateRestServer(); err != nil {
						log.Debugf("err : %s", err)
						return err
					}
				}
				// copy all files at root level, fire this at last
				if err := dotNetMVCFrameworkCopier.CreateRootLevelFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
			} else {
				return fmt.Errorf("unsupported framework %s  for template %s for language %s", n.RestConfig.Framework, n.RestConfig.Template, n.Language)
			}
		}
	}

	return nil
}

func getDotNetMVCFrameworkCopier(dotNetValues *DotNetValues) *dotnetmvcframework.Copier {
	gitPlatformURL := dotNetValues.Values.Get(languages.GitPlatformURL)
	gitPlatformUserName := dotNetValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := dotNetValues.Values.Get(languages.GitRepositoryName)
	nodeName := dotNetValues.Values.Get(languages.NodeName)
	nodeDirectoryName := dotNetValues.Values.NodeDirectoryName
	path := GetDotNetTemplatesRootPath() + "/frameworks/" + NetMVCFramework

	copier := dotnetmvcframework.NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, path)
	return copier
}
