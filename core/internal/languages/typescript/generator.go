package typescript

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/typescript/integrations/kubernetes"
	log "github.com/sirupsen/logrus"
)

// Generate generates typescript specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	typescriptValues := ctx.Value(ContextVars).(Values)
	n := typescriptValues.TypeScriptNode
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
	integrationsCopier := getIntegrationsCopier(typescriptValues)
	if err := integrationsCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(typescriptValues Values) *kubernetes.Copier {
	userName := typescriptValues.Values.Get(languages.UserName)
	repositoryName := typescriptValues.Values.Get(languages.RepositoryName)
	nodeName := typescriptValues.Values.Get(languages.NodeName)
	nodeDirectoryName := typescriptValues.Values.NodeDirectoryName
	isServer := typescriptValues.TypeScriptNode.RestConfig.Server != nil
	serverPort := typescriptValues.TypeScriptNode.RestConfig.Server.Port
	typescriptTemplatesRootPath := GetTypeScriptTemplatesRootPath()

	// create typescript specific copier
	copier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, typescriptTemplatesRootPath, isServer, serverPort)
	return copier
}
