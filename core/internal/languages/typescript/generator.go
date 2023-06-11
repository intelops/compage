package typescript

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/templates"
	"github.com/intelops/compage/core/internal/languages/typescript/integrations/kubernetes"
	log "github.com/sirupsen/logrus"
)

// Generate generates typescript specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	typescriptValues := ctx.Value(contextKeyTypeScriptContextVars).(Values)
	n := typescriptValues.TypeScriptNode
	// rest config
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Template == templates.OpenAPI {
			// add code to generate with openapi
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

	// k8s files need to be generated for the whole project so, it should be here.
	m := getIntegrationsCopier(typescriptValues)

	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err := k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(typescriptValues Values) map[string]interface{} {
	userName := typescriptValues.Values.Get(languages.UserName)
	repositoryName := typescriptValues.Values.Get(languages.RepositoryName)
	nodeName := typescriptValues.Values.Get(languages.NodeName)
	nodeDirectoryName := typescriptValues.Values.NodeDirectoryName
	isRestServer := typescriptValues.TypeScriptNode.RestConfig.Server != nil
	restServerPort := typescriptValues.TypeScriptNode.RestConfig.Server.Port
	path := GetTypeScriptTemplatesRootPath()

	// create typescript specific copier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	return map[string]interface{}{
		"k8s": k8sCopier,
	}
}
