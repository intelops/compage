package ruby

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-ruby"

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
