package golang

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-go"
const GoGinServerFramework = "go-gin-server"
const GoGrpcServerFramework = "go-grpc-server"
const CommonFiles = "common-files"

var templatesRootPath = utils.GetProjectRootPath(TemplatesPath)

// LGolangNode language specific struct.
type LGolangNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LGolangNode) FillDefaults() error {
	return nil
}

func GetGoTemplatesRootPath() string {
	return templatesRootPath
}
