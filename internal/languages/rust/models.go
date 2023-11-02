package rust

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-rust"

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
