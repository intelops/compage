package java

import (
	"context"
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/java/integrations/devspace"
	"github.com/intelops/compage/core/internal/languages/java/integrations/docker"
	"github.com/intelops/compage/core/internal/languages/java/integrations/kubernetes"
	"github.com/intelops/compage/core/internal/languages/templates"
	log "github.com/sirupsen/logrus"
)

// Generate generates java specific code according to config passed
func Generate(ctx context.Context) error {
	// extract node
	javaValues := ctx.Value(contextKeyJavaContextVars).(Values)
	n := javaValues.JavaNode
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

	// devspace.yaml and devspace_start.sh need to be generated for the whole project so, it should be here.
	devspaceCopier := m["devspace"].(*devspace.Copier)
	if err := devspaceCopier.CreateDevspaceConfigs(); err != nil {
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
	if javaValues.JavaNode.RestConfig.Framework == Spring {
		generatedJarName = "openapi-spring-1.0.0.jar"
	} else if javaValues.JavaNode.RestConfig.Framework == LJavaUndertowServer {
		generatedJarName = "openapi-undertow-server-1.0.0.jar"
	} else if javaValues.JavaNode.RestConfig.Framework == LJavaMicronautServer {
		generatedJarName = "openapi-micronaut-1.0.0.jar"
	}

	// create java specific dockerCopier
	dockerCopier := docker.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, generatedJarName, isRestServer, restServerPort)

	// create java specific k8sCopier
	k8sCopier := kubernetes.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	// create java specific devspaceCopier
	devspaceCopier := devspace.NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, path, isRestServer, restServerPort)

	return map[string]interface{}{
		"docker":   dockerCopier,
		"k8s":      k8sCopier,
		"devspace": devspaceCopier,
	}
}
