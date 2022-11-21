package golang

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
	"github.com/kube-tarian/compage-core/internal/utils"
)

// Generator generates golang specific code according to config passed
func Generator(coreProject *core.Project, node node.Node) error {
	// This will be used to create clients to other servers. This is required for custom template plus the
	// cli/frameworks plan for next release
	otherServersInfo, err := languages.GetOtherServersInfo(coreProject.CompageYaml.Edges, node)
	if err != nil {
		return err
	}

	goNode := GetNode(node)
	if goNode.ConsumerData.Template == Compage {
		// copy required files from templates, a few of them may need renaming.
		// Iterate over all the files in template folder

		// retrieve project named directory
		projectDirectory := utils.GetProjectDirectoryName(coreProject.Name)

		// create node directory in projectDirectory depicting a subproject
		nodeDirectoryName := projectDirectory + "/" + goNode.ConsumerData.Name
		if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
			return err
		}

		// copy all files at root level
		err = languages.CopyRootLevelFiles(utils.GolangTemplatesPath, nodeDirectoryName)
		if err != nil {
			return err
		}

		// copy relevant files from templates based on config received, if the node is server
		if goNode.ConsumerData.IsServer {
			for _, serverType := range goNode.ConsumerData.ServerTypes {
				s := serverType["TYPE"]
				fmt.Println(s)
				p := serverType["PROTOCOL"]
				fmt.Println(p)
				port := serverType["PORT"]
				fmt.Println(port)
			}
		}

		//if the node is client, add client code
		if goNode.ConsumerData.IsClient {
			// extract server ports and source - needed this for url
			fmt.Println(otherServersInfo)
		}
	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}
