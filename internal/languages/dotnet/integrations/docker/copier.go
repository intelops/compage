package docker

import (
	"github.com/intelops/compage/internal/languages/dotnet/frameworks"
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"strings"
)

const File = "Dockerfile.tmpl"

// Copier integrations specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	RestServerPort    string
}

func NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"MicroServiceName":    frameworks.GetMicroServiceName(nodeDirectoryName),
		"GitPlatformUserName": gitPlatformUserName,
	}

	if isRestServer {
		data["RestServerPort"] = restServerPort
	}
	data["IsRestServer"] = isRestServer

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		IsRestServer:      isRestServer,
		RestServerPort:    restServerPort,
		Data:              data,
	}
}

// CreateDockerFile creates the required file from language template.
func (c Copier) CreateDockerFile() error {
	var filePaths []*string
	// copy dockerfile
	targetDockerFileName := c.NodeDirectoryName + "/" + File
	_, err := utils.CopyFile(targetDockerFileName, c.TemplatesRootPath+"/"+File)
	if err != nil {
		log.Errorf("error while copying dockerfile [" + err.Error() + "]")
		return err
	}
	filePaths = append(filePaths, &targetDockerFileName)
	return executor.Execute(filePaths, c.Data)
}
