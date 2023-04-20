package golang

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	goginserver "github.com/intelops/compage/core/internal/languages/golang/frameworks/go-gin-server"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/docker"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/githubactions"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
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
		return fmt.Errorf("unsupported protocol %s for language %s", "grpc", n.Language)
	}
	// ws config
	if n.WsConfig != nil {
		return fmt.Errorf("unsupported protocol %s for language %s", "ws", n.Language)
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
	return nil
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
	// create golang specific copier
	copier := goginserver.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort, resources, clients)
	return copier
}

func getIntegrationsCopier(goValues GoValues) map[string]interface{} {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isRestServer := goValues.LGoLangNode.RestConfig.Server != nil
	restServerPort := goValues.LGoLangNode.RestConfig.Server.Port
	path := GetGoTemplatesRootPath()

	// create golang specific dockerCopier
	dockerCopier := docker.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	// create golang specific k8sCopier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	// create golang specific k8sCopier
	githubActionsCopier := githubactions.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path)

	return map[string]interface{}{
		"docker":        dockerCopier,
		"k8s":           k8sCopier,
		"githubActions": githubActionsCopier,
	}
}
