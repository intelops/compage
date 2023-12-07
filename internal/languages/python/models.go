package python

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-python"

// LPythonNode language specific struct.
type LPythonNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LPythonNode) FillDefaults() error {
	return nil
}

func GetPythonTemplatesRootPath() string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
