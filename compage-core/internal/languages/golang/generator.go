package golang

import (
	"errors"
	"github.com/kube-tarian/compage-core/internal/languages"
	"github.com/kube-tarian/compage-core/internal/utils"
)

// Generator generates golang specific code according to config passed
func Generator(projectName string, goNode *GoNode) error {
	// Copy required files from templates, a few of them may need renaming.
	// Iterate over all the files in template folder
	if goNode.Template == languages.Compage {
		// retrieve project named directory
		projectDirectory := utils.GetProjectDirectoryName(projectName)

		// create node directory in projectDirectory depicting a subproject
		nodeDirectoryName := projectDirectory + "/" + goNode.Name
		if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
			return err
		}

		// create neutralCopier
		neutralCopier := languages.NeutralCopier{
			NodeDirectoryName: nodeDirectoryName,
		}

		// copy all files at root level
		err := neutralCopier.CreateRootLevelFiles(utils.GolangTemplatesPath)
		if err != nil {
			return err
		}

		// copy kubernetes yamls
		err = neutralCopier.CreateKubernetesFiles(utils.GolangTemplatesPath)
		if err != nil {
			return err
		}

		// create golang specific copier
		copier := Copier{
			NodeDirectoryName: nodeDirectoryName,
			GoNode:            *goNode,
		}

		// copy relevant files from templates based on config received, if the node is server
		if goNode.RestConfig != nil {
			if err = copier.CreateRestConfigs(); err != nil {
				return err
			}
		}
	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}
