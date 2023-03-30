package typescript

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LTypeScriptNode language specific struct.
type LTypeScriptNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LTypeScriptNode) FillDefaults() error {
	return nil
}

func GetTypeScriptTemplatesRootPath() string {
	return templatesRootPath
}
