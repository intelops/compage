package rust

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/rust/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates rust specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	rustValues := ctx.Value(ContextVars).(Values)
	n := rustValues.RustNode
	// rest config
	if n.RestConfig != nil {
		// check for the templates
		if n.RestConfig.Server.Template == templates.OpenApi {
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

	// k8s files need to be generated for the whole project so, it should be here.
	m := getIntegrationsCopier(rustValues)

	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err := k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(rustValues Values) map[string]interface{} {
	userName := rustValues.Values.Get(languages.UserName)
	repositoryName := rustValues.Values.Get(languages.RepositoryName)
	nodeName := rustValues.Values.Get(languages.NodeName)
	nodeDirectoryName := rustValues.Values.NodeDirectoryName
	isRestServer := rustValues.RustNode.RestConfig.Server != nil
	restServerPort := rustValues.RustNode.RestConfig.Server.Port
	path := GetRustTemplatesRootPath()

	// create rust specific copier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	return map[string]interface{}{
		"k8s": k8sCopier,
	}
}
