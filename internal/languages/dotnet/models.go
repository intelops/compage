package dotnet

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-dotnet"
const NetCleanArchitectureFramework = "dotnet-clean-architecture"

// LDotNetLangNode language specific struct.
type LDotNetLangNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LDotNetLangNode) FillDefaults() error {
	if n.LanguageNode != nil {
		if n.LanguageNode.RestConfig != nil && n.LanguageNode.RestConfig.Server != nil && n.LanguageNode.RestConfig.Server.Resources != nil {
			for _, resource := range n.LanguageNode.RestConfig.Server.Resources {
				if resource.AllowedMethods == nil {
					defaultMethods := []string{"GET", "POST", "PUT", "DELETE", "LIST"}
					stringPointers := func() []*string {
						s := make([]*string, len(defaultMethods))
						for i := range defaultMethods {
							s[i] = &defaultMethods[i]
						}
						return s
					}()

					resource.AllowedMethods = stringPointers
				}
			}
		}
	}
	return nil
}

func GetDotNetTemplatesRootPath() string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
