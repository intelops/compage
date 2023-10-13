package dotnet

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-dotnet"
const NetMVCFramework = "dotnet-mvc-framework"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LDotNetLangNode language specific struct.
type LDotNetLangNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LDotNetLangNode) FillDefaults() error {
	return nil
}

func GetDotNetTemplatesRootPath() string {
	return templatesRootPath
}
