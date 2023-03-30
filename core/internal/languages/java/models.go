package java

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
// TODO changed later
const TemplatesPath = "templates/compage-template-go"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LJavaNode language specific struct.
type LJavaNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LJavaNode) FillDefaults() error {
	return nil
}

func GetJavaTemplatesRootPath() string {
	return templatesRootPath
}
