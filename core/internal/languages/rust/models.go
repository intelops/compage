package rust

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LRustNode language specific struct.
type LRustNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LRustNode) FillDefaults() error {
	return nil
}

func GetRustTemplatesRootPath() string {
	return templatesRootPath
}
