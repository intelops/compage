package java

import (
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// TemplateDirectoryName directory of template files
const TemplateDirectoryName = "compage-template-java"

var LJavaPlayFramework = "java-play-framework"
var LJavaMicronautServer = "java-micronaut-server"
var Spring = "spring"
var LJavaUndertowServer = "java-undertow-server"

var OpenAPISupportedFrameworks = []string{LJavaMicronautServer, Spring, LJavaUndertowServer, LJavaPlayFramework}

// LJavaNode language specific struct.
type LJavaNode struct {
	*languages.LanguageNode
}

// FillDefaults constructor function
func (n *LJavaNode) FillDefaults() error {
	return nil
}

func GetJavaTemplatesRootPath() string {
	templatesRootPath, err := utils.GetTemplatesRootPath(TemplateDirectoryName)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return ""
	}
	return templatesRootPath
}
