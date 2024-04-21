package typescript

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/templates"
	"github.com/intelops/compage/internal/languages/typescript/integrations/kubernetes"
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
				log.Errorf("err : %s", err)
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
	m, err := getIntegrationsCopier(typescriptValues)
	if err != nil {
		log.Errorf("error while getting the integrations copier [" + err.Error() + "]")
		return err
	}

	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err := k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(typescriptValues Values) (map[string]interface{}, error) {
	typeScriptTemplatesRootPath := GetTypeScriptTemplatesRootPath(typescriptValues.Values.CompageCoreVersion)
	if typeScriptTemplatesRootPath == "" {
		return nil, errors.New("typescript templates root path is empty")
	}
	gitPlatformUserName := typescriptValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := typescriptValues.Values.Get(languages.GitRepositoryName)
	nodeName := typescriptValues.Values.Get(languages.NodeName)
	nodeDirectoryName := typescriptValues.Values.NodeDirectoryName
	isRestServer := typescriptValues.TypeScriptNode.RestConfig.Server != nil
	restServerPort := typescriptValues.TypeScriptNode.RestConfig.Server.Port

	// create typescript specific copier
	k8sCopier := kubernetes.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, typeScriptTemplatesRootPath, isRestServer, restServerPort)

	return map[string]interface{}{
		"k8s": k8sCopier,
	}, nil
}
