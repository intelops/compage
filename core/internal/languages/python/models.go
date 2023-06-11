package python

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-python"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LPythonNode language specific struct.
type LPythonNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LPythonNode) FillDefaults() error {
	return nil
}

func GetPythonTemplatesRootPath() string {
	return templatesRootPath
}
