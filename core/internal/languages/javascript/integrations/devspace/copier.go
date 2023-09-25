package devspace

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const YamlFile = "devspace.yaml.tmpl"
const StartShFile = "devspace_start.sh.tmpl"

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
		"GitPlatformUserName": gitPlatformUserName,
	}

	if isRestServer {
		data["RestServerPort"] = restServerPort
		data["IsRestServer"] = isRestServer
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		IsRestServer:      isRestServer,
		RestServerPort:    restServerPort,
		Data:              data,
	}
}

// CreateDevspaceConfigs creates required file from language template.
func (c Copier) CreateDevspaceConfigs() error {
	var filePaths []string
	// copy devspace.yml
	targetDevspaceYamlName := c.NodeDirectoryName + "/" + YamlFile
	const DevspaceSrcPath = "/devspace/"
	_, err := utils.CopyFile(targetDevspaceYamlName, c.TemplatesRootPath+DevspaceSrcPath+YamlFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetDevspaceYamlName)

	// copy devspace_start.sh
	targetDevspaceStartShFileName := c.NodeDirectoryName + "/" + StartShFile
	_, err = utils.CopyFile(targetDevspaceStartShFileName, c.TemplatesRootPath+DevspaceSrcPath+StartShFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetDevspaceStartShFileName)

	return executor.Execute(filePaths, c.Data)
}
