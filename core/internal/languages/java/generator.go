package java

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/java/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates java specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	javaValues := ctx.Value(ContextVars).(Values)
	n := javaValues.JavaNode
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

	// k8s files needs to be generated for the whole project so, it should be here.
	integrationsCopier := getIntegrationsCopier(javaValues)
	if err := integrationsCopier.CreateKubernetesFiles(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}

func getIntegrationsCopier(javaValues Values) *kubernetes.Copier {
	userName := javaValues.Values.Get(languages.UserName)
	repositoryName := javaValues.Values.Get(languages.RepositoryName)
	nodeName := javaValues.Values.Get(languages.NodeName)
	nodeDirectoryName := javaValues.Values.NodeDirectoryName
	isServer := javaValues.JavaNode.RestConfig.Server != nil
	serverPort := javaValues.JavaNode.RestConfig.Server.Port
	javaTemplatesRootPath := GetJavaTemplatesRootPath()

	// create java specific copier
	copier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, javaTemplatesRootPath, isServer, serverPort)
	return copier
}
