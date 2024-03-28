package javascript

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-javascript"

// LJavaScriptNode language specific struct.
type LJavaScriptNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LJavaScriptNode) FillDefaults() error {
	return nil
}

func GetJavaScriptTemplatesRootPath(version string) string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName, version)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
