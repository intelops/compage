package python

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/python/integrations/kubernetes"
	log "github.com/sirupsen/logrus"
)

// Generate generates python specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	pythonValues := ctx.Value(ContextVars).(Values)
	n := pythonValues.PythonNode
	// rest config
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Server.Template == languages.OpenApi {
			// add code to generate with openapi
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
	integrationsCopier := getIntegrationsCopier(pythonValues)
	if err := integrationsCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(pythonValues Values) *kubernetes.Copier {
	userName := pythonValues.Values.Get(languages.UserName)
	repositoryName := pythonValues.Values.Get(languages.RepositoryName)
	nodeName := pythonValues.Values.Get(languages.NodeName)
	nodeDirectoryName := pythonValues.Values.NodeDirectoryName
	isServer := pythonValues.PythonNode.RestConfig.Server != nil
	serverPort := pythonValues.PythonNode.RestConfig.Server.Port
	pythonTemplatesRootPath := GetPythonTemplatesRootPath()

	// create python specific copier
	copier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, pythonTemplatesRootPath, isServer, serverPort)
	return copier
}
