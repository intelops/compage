package golang

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// GoNode language specific struct.
type GoNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (goNode *GoNode) FillDefaults() error {
	for _, client := range goNode.RestConfig.Clients {
		// set the default framework.
		if client.Framework == "" {
			client.Framework = "go-gin-server"
		}
	}
	return nil
}

func GetGoTemplatesRootPath() string {
	return templatesRootPath
}
