package python

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/python/integrations/devspace"
	"github.com/intelops/compage/internal/languages/python/integrations/kubernetes"
	"github.com/intelops/compage/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates python specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	pythonValues := ctx.Value(contextKeyPythonContextVars).(Values)
	n := pythonValues.PythonNode
	// rest config
	if n.RestConfig != nil {
		if n.RestConfig.Template == templates.OpenAPI {
			// check for the templates
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
	m, err := getIntegrationsCopier(pythonValues)
	if err != nil {
		log.Errorf("error while getting the integrations copier [" + err.Error() + "]")
		return err
	}

	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err = k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// devspace.yaml and devspace_start.sh need to be generated for the whole project so, it should be here.
	devspaceCopier := m["devspace"].(*devspace.Copier)
	if err = devspaceCopier.CreateDevspaceConfigs(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(pythonValues Values) (map[string]interface{}, error) {
	pythonTemplatesRootPath := GetPythonTemplatesRootPath(pythonValues.Values.CompageCoreVersion)
	if pythonTemplatesRootPath == "" {
		return nil, errors.New("python templates root path is empty")
	}
	gitPlatformUserName := pythonValues.Values.Get(languages.GitPlatformUserName)
	gitRepositoryName := pythonValues.Values.Get(languages.GitRepositoryName)
	nodeName := pythonValues.Values.Get(languages.NodeName)
	nodeDirectoryName := pythonValues.Values.NodeDirectoryName
	isRestServer := pythonValues.PythonNode.RestConfig.Server != nil
	restServerPort := pythonValues.PythonNode.RestConfig.Server.Port

	// create python specific k8sCopier
	k8sCopier := kubernetes.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, pythonTemplatesRootPath, isRestServer, restServerPort)

	// create python specific devspaceCopier
	devspaceCopier := devspace.NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, pythonTemplatesRootPath, isRestServer, restServerPort)

	return map[string]interface{}{
		"k8s":      k8sCopier,
		"devspace": devspaceCopier,
	}, nil
}
