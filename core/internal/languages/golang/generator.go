package golang

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/golang/frameworks/go-gin-server"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates golang specific code according to config passed
func Generate(ctx context.Context) error {
	// extract goNode
	goValues := ctx.Value(GoContextVars).(GoValues)
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
				// copy all files at root level, fire this at last(TODO - remove dockerfile from below and add it to docker integration)
				if err := goGinServerCopier.CreateRootLevelFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
			} else {
				return errors.New(fmt.Sprintf("unsupported framework %s  for template %s for language %s", n.RestConfig.Server.Framework, n.RestConfig.Server.Template, n.Language))
			}
		} else {
			if n.RestConfig.Server.Template != templates.OpenApi {
				// call openapi generator
				return errors.New(fmt.Sprintf("unsupported template %s for language %s", n.RestConfig.Server.Template, n.Language))
			}
			// check if OpenApiFileYamlContent contains value.
			if len(n.RestConfig.Server.OpenApiFileYamlContent) < 1 {
				return errors.New("at least rest-config needs to be provided, OpenApiFileYamlContent is empty")
			}

			if err := languages.ProcessOpenApiTemplate(ctx); err != nil {
				return err
			}
		}
	}
	// grpc config
	if n.GrpcConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "grpc", n.Language))
	}
	// ws config
	if n.WsConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "ws", n.Language))
	}

	// k8s files needs to be generated for the whole project so, it should be here.
	integrationsCopier := getIntegrationsCopier(goValues)
	if err := integrationsCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getGoGinServerCopier(goValues GoValues) *go_gin_server.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isServer := goValues.LGoLangNode.RestConfig.Server != nil
	serverPort := goValues.LGoLangNode.RestConfig.Server.Port
	resources := goValues.LGoLangNode.RestConfig.Server.Resources
	clients := goValues.LGoLangNode.RestConfig.Clients
	goTemplatesRootPath := GetGoTemplatesRootPath()
	// create golang specific copier
	copier := go_gin_server.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isServer, serverPort, resources, clients)
	return copier
}

func getIntegrationsCopier(goValues GoValues) *kubernetes.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isServer := goValues.LGoLangNode.RestConfig.Server != nil
	serverPort := goValues.LGoLangNode.RestConfig.Server.Port
	goTemplatesRootPath := GetGoTemplatesRootPath()

	// create golang specific copier
	copier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isServer, serverPort)
	return copier
}
