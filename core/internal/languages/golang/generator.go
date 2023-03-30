package golang

import (
	"errors"
	"fmt"
	"github.com/intelops/compage/core/internal/languages"
)

// Generator generates golang specific code according to config passed
func Generator(goNode *GoNode, copier *Copier) error {
	// copy relevant files from templates based on config received, if the node is server
	// rest config
	if goNode.RestConfig != nil {
		// check for the templates
		if goNode.RestConfig.Server.Template == languages.Compage {
			if err := copier.CreateRestConfigs(); err != nil {
				return err
			}
		} else {
			if goNode.RestConfig.Server.Template != languages.OpenApi {
				return errors.New(fmt.Sprintf("unsupported template %s for language %s", goNode.RestConfig.Server.Template, goNode.Language))
			}
			// add code to generate with openapi
		}
	}
	// grpc config
	if goNode.GrpcConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "grpc", goNode.Language))
	}
	// ws config
	if goNode.WsConfig != nil {
		return errors.New(fmt.Sprintf("unsupported protocol %s for language %s", "ws", goNode.Language))
	}

	// copy kubernetes yaml files
	err := copier.CreateKubernetesFiles()
	if err != nil {
		return err
	}

	// copy all files at root level
	err0 := copier.CreateRootLevelFiles()
	if err0 != nil {
		return err0
	}
	return nil
}
