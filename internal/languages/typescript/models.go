package typescript

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-typescript"

// LTypeScriptNode language specific struct.
type LTypeScriptNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LTypeScriptNode) FillDefaults() error {
	return nil
}

func GetTypeScriptTemplatesRootPath() string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
