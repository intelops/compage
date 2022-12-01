package golang

import (
	"context"
	"errors"
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
			err := copier.CreateKubernetesFiles(utils.GolangTemplatesPath)
			if err != nil {
				return err
			}

			// copy all files at root level
			err = copier.CreateRootLevelFiles(utils.GolangTemplatesPath)
			if err != nil {
				return err
			}
		} else {
			return errors.New("at least rest-config needs to be provided")
		}
	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}
