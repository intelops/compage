package golang

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-go"
const GoGinServerFramework = "go-gin-server"
const GoGrpcServerFramework = "go-grpc-server"
const CommonFiles = "common-files"

// LGolangNode language specific struct.
type LGolangNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LGolangNode) FillDefaults() error {
	if n.LanguageNode != nil {
		if n.LanguageNode.RestConfig != nil && n.LanguageNode.RestConfig.Server != nil && n.LanguageNode.RestConfig.Server.Resources != nil {
			for _, resource := range n.LanguageNode.RestConfig.Server.Resources {
				if resource.AllowedMethods == nil {
					defaultMethods := []string{"GET", "POST", "PUT", "DELETE"}
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

func GetGoTemplatesRootPath() string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
