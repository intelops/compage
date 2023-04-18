package java

import (
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
)

// TemplatesPath directory of template files
const TemplatesPath = "templates/compage-template-java"

var LJavaPlayFramework = "java-play-framework"
var LJavaMicronautServer = "java-micronaut-server"
var Spring = "spring"
var LJavaUndertowServer = "java-undertow-server"

var OpenAPISupportedFrameworks = []string{LJavaMicronautServer, Spring, LJavaUndertowServer, LJavaPlayFramework}

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
