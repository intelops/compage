package kubernetes

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"strings"
)

// Copier integrations specific copier
type Copier struct {
	NodeDirectoryName   string
	GoTemplatesRootPath string
	Data                map[string]interface{}
	IsServer            bool
	Port                string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath string, isServer bool, serverPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	// set all resources for main.go.tmpl
	if isServer {
		data["ServerPort"] = serverPort
		data["IsServer"] = isServer
	}

	return &Copier{
		GoTemplatesRootPath: goTemplatesRootPath,
		NodeDirectoryName:   nodeDirectoryName,
		Data:                data,
	}
}

// CreateDockerFile creates Dockerfile from language template.
func (c Copier) CreateDockerFile() error {
	var filePaths []string
	//TODO add impl
	filePaths = append(filePaths, "")
	return executor.Execute(filePaths, c.Data)
}
