package java

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/java/integrations/docker"
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

	// k8s files need to be generated for the whole project so, it should be here.
	m := getIntegrationsCopier(javaValues)

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

func getIntegrationsCopier(javaValues Values) map[string]interface{} {
	userName := javaValues.Values.Get(languages.UserName)
	repositoryName := javaValues.Values.Get(languages.RepositoryName)
	nodeName := javaValues.Values.Get(languages.NodeName)
	nodeDirectoryName := javaValues.Values.NodeDirectoryName
	isRestServer := javaValues.JavaNode.RestConfig.Server != nil
	restServerPort := javaValues.JavaNode.RestConfig.Server.Port
	path := GetJavaTemplatesRootPath()
	// extract generatedJar name
	generatedJarName := ""
	if javaValues.JavaNode.RestConfig.Server.Framework == Spring {
		generatedJarName = "openapi-spring-1.0.0.jar"
	} else if javaValues.JavaNode.RestConfig.Server.Framework == LJavaUndertowServer {
		generatedJarName = "openapi-undertow-server-1.0.0.jar"
	} else if javaValues.JavaNode.RestConfig.Server.Framework == LJavaMicronautServer {
		generatedJarName = "openapi-micronaut-1.0.0.jar"
	}

	// create java specific dockerCopier
	dockerCopier := docker.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, generatedJarName, isRestServer, restServerPort)

	// create java specific k8sCopier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	return map[string]interface{}{
		"docker": dockerCopier,
		"k8s":    k8sCopier,
	}
}
