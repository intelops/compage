package rust

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/rust/integrations/kubernetes"
	"github.com/intelops/compage/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates rust specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	rustValues := ctx.Value(contextKeyRustContextVars).(Values)
	n := rustValues.RustNode
	// rest config
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Template == templates.OpenAPI {
			if n.RestConfig.Server != nil {
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
	m, err := getIntegrationsCopier(rustValues)
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

func getIntegrationsCopier(rustValues Values) (map[string]interface{}, error) {
	rustTemplatesRootPath := GetRustTemplatesRootPath()
	if rustTemplatesRootPath == "" {
		return nil, errors.New("rust templates root path is empty")
	}
	gitPlatformUserName := rustValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := rustValues.Values.Get(languages.GitRepositoryName)
	nodeName := rustValues.Values.Get(languages.NodeName)
	nodeDirectoryName := rustValues.Values.NodeDirectoryName
	isRestServer := rustValues.RustNode.RestConfig.Server != nil
	restServerPort := rustValues.RustNode.RestConfig.Server.Port

	// create rust specific copier
	k8sCopier := kubernetes.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, rustTemplatesRootPath, isRestServer, restServerPort)

	return map[string]interface{}{
		"k8s": k8sCopier,
	}, nil
}
