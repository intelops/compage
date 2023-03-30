package ruby

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LRubyNode language specific struct.
type LRubyNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LRubyNode) FillDefaults() error {
	return nil
}

func GetRubyTemplatesRootPath() string {
	return templatesRootPath
}
