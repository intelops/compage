package golang

import (
	"errors"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/languages"
)

// GoGenerator generates golang specific code according to config passed
func GoGenerator(coreProject *core.Project, goNode *GoNode) error {
	// if Template is not set, consider that the default compage template needs to be used.
	if goNode.ConsumerData.Template == "" || goNode.ConsumerData.Template == Compage {

	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}
