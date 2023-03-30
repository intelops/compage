package golang

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/golang/frameworks/go_gin_server"
	"github.com/intelops/compage/core/internal/languages/golang/integrations/kubernetes"
	log "github.com/sirupsen/logrus"
)

// Generate generates golang specific code according to config passed
func Generate(ctx context.Context) error {
	// extract goNode
	goValues := ctx.Value(GoContextVars).(GoValues)
	goNode := goValues.GoNode
	// rest config
	if goNode.RestConfig != nil {
		// check for the templates
		if goNode.RestConfig.Server.Template == languages.Compage {
			if goNode.RestConfig.Server.Framework == "go-gin-server" {
				goGinServerCopier := getGoGinServerCopier(goValues)
				if err := goGinServerCopier.CreateRestConfigs(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}

				integrationsCopier := getIntegrationsCopier(goValues)
				if err := integrationsCopier.CreateKubernetesFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}

				// copy all files at root level
				if err := goGinServerCopier.CreateRootLevelFiles(); err != nil {
					log.Debugf("err : %s", err)
					return err
				}
			} else {
				return errors.New(fmt.Sprintf("unsupported framework %s  for template %s for language %s", goNode.RestConfig.Server.Framework, goNode.RestConfig.Server.Template, goNode.Language))
			}
		} else {
			if goNode.RestConfig.Server.Template != languages.OpenApi {
				// call openapi generator
				return errors.New(fmt.Sprintf("unsupported template %s for language %s", goNode.RestConfig.Server.Template, goNode.Language))
			}
			// add code to generate with openapi
		}
	}
	// grpc config
	if goNode.GrpcConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "grpc", goNode.Language))
	}
	// ws config
	if goNode.WsConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "ws", goNode.Language))
	}

	return nil
}

func getGoGinServerCopier(goValues GoValues) *go_gin_server.Copier {
	userName := goValues.Values.Get(languages.UserName)
	repositoryName := goValues.Values.Get(languages.RepositoryName)
	nodeName := goValues.Values.Get(languages.NodeName)
	nodeDirectoryName := goValues.Values.NodeDirectoryName
	isServer := goValues.GoNode.RestConfig.Server != nil
	serverPort := goValues.GoNode.RestConfig.Server.Port
	resources := goValues.GoNode.RestConfig.Server.Resources
	clients := goValues.GoNode.RestConfig.Clients
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
	isServer := goValues.GoNode.RestConfig.Server != nil
	serverPort := goValues.GoNode.RestConfig.Server.Port
	goTemplatesRootPath := GetGoTemplatesRootPath()

	// create golang specific copier
	copier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath, isServer, serverPort)
	return copier
}
