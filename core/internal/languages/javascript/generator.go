package javascript

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/javascript/integrations/docker"
	"github.com/intelops/compage/core/internal/languages/javascript/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates javascript specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	javascriptValues := ctx.Value(ContextVars).(Values)
	n := javascriptValues.JavaScriptNode
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
	m := getIntegrationsCopier(javascriptValues)

	// dockerfile needs to be generated for the whole project so, it should be here.
	dockerCopier := m["docker"].(*docker.Copier)
	if err := dockerCopier.CreateDockerFile(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	k8sCopier := m["k8s"].(*kubernetes.Copier)
	if err := k8sCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(javascriptValues Values) map[string]interface{} {
	userName := javascriptValues.Values.Get(languages.UserName)
	repositoryName := javascriptValues.Values.Get(languages.RepositoryName)
	nodeName := javascriptValues.Values.Get(languages.NodeName)
	nodeDirectoryName := javascriptValues.Values.NodeDirectoryName
	isRestServer := javascriptValues.JavaScriptNode.RestConfig.Server != nil
	restServerPort := javascriptValues.JavaScriptNode.RestConfig.Server.Port
	path := GetJavaScriptTemplatesRootPath()

	// create javascript specific dockerCopier
	dockerCopier := docker.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	// create javascript specific k8sCopier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	return map[string]interface{}{
		"docker": dockerCopier,
		"k8s":    k8sCopier,
	}
}
