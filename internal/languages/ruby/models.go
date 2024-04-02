package ruby

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-ruby/code"

// LRubyNode language specific struct.
type LRubyNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LRubyNode) FillDefaults() error {
	return nil
}

func GetRubyTemplatesRootPath(version string) string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName, version)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
