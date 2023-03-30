package javascript

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LJavaScriptNode language specific struct.
type LJavaScriptNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LJavaScriptNode) FillDefaults() error {
	return nil
}

func GetJavaScriptTemplatesRootPath() string {
	return templatesRootPath
}
