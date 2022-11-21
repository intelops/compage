package golang

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
)

// Generator generates golang specific code according to config passed
func Generator(coreProject *core.Project, node node.Node) error {
	// This will be used to create clients to other servers
	// this is required for custom template plus the clis plan for next release
	otherServersInfo, err := languages.GetOtherServersInfo(coreProject.CompageYaml.Edges, node)
	if err != nil {
		return err
	}

	fmt.Println(otherServersInfo)
	goNode := GetNode(node)
	if goNode.ConsumerData.Template == Compage {
		// copy required files from templates, a few of them may need renaming
		// iterate over all the files in template folder

	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}
