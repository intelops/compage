package golang

import (
	"context"
	"errors"
	"fmt"
	"github.com/kube-tarian/compage/core/internal/generator"
	"github.com/kube-tarian/compage/core/internal/languages"
	"github.com/kube-tarian/compage/core/internal/utils"
)

// Generator generates golang specific code according to config passed
func Generator(ctx context.Context) error {
	values := ctx.Value(ContextVars).(Values)
	goNode := values.GoNode
	nodeDirectoryName := values.NodeDirectoryName

	// Copy required files from templates, a few of them may need renaming.
	// Iterate over all the files in template folder
	if goNode.Template == languages.Compage {
		// create node directory in projectDirectory depicting a subproject
		if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
			return err
		}

		// copy relevant files from templates based on config received, if the node is server
		if goNode.RestConfig != nil {
			// create golang specific copier
			copier := NewCopier(ctx)

			if err := copier.CreateRestConfigs(); err != nil {
				return err
			}

			// copy kubernetes yaml's
			err := copier.CreateKubernetesFiles(utils.GetProjectRootPath())
			if err != nil {
				return err
			}

			// copy all files at root level
			err = copier.CreateRootLevelFiles(utils.GetProjectRootPath())
			if err != nil {
				return err
			}
		} else {
			return errors.New("at least rest-config needs to be provided")
		}
	} else if goNode.Template == languages.OpenApi {
		// TODO take consider template first and then language (the impl is reversed as of now)
		// create node directory in projectDirectory depicting a subproject
		if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
			return err
		}
		// copy relevant files from templates based on config received, if the node is server
		if goNode.RestConfig != nil && len(goNode.RestConfig.Server.OpenApiFileYamlContent) > 0 {
			// create golang specific copier
			//copier := NewCopier(ctx)
			// TODO call openapi-generator
			err := generator.OpenApiGeneratorRunner("generate", "-i", "https://raw.githubusercontent.com/openapitools/openapi-generator/master/modules/openapi-generator/src/test/resources/3_0/petstore.yaml", "-g", "ruby", "-o", "/tmp/tes1/")
			if err != nil {
				return errors.New("something happened while running openApi generator")
			}
			// copy kubernetes yaml's
			//err := copier.CreateKubernetesFiles(utils.GetProjectRootPath())
			//if err != nil {
			//	return err
			//}
		} else {
			return errors.New("at least rest-config needs to be provided")
		}
	} else {
		// frameworks cli tools
		return errors.New(fmt.Sprintf("unsupported template for language : %s", languages.Go))
	}
	return nil
}
