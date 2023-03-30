package python

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LPythonNode language specific struct.
type LPythonNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LPythonNode) FillDefaults() error {
	for _, client := range n.RestConfig.Clients {
		// set the default framework.
		if client.Framework == "" {
			client.Framework = "python-flask"
		}
	}
	return nil
}

func GetPythonTemplatesRootPath() string {
	return templatesRootPath
}
