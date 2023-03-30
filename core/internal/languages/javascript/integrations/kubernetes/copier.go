package kubernetes

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const Path = "/kubernetes"
const DeploymentFile = "deployment.yaml.tmpl"
const ServiceFile = "service.yaml.tmpl"

// Copier integrations specific copier
type Copier struct {
	NodeDirectoryName           string
	JavaScriptTemplatesRootPath string
	Data                        map[string]interface{}
	IsServer                    bool
	Port                        string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, javascriptTemplatesRootPath string, isServer bool, serverPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	if isServer {
		data["ServerPort"] = serverPort
		data["IsServer"] = isServer
	}

	return &Copier{
		JavaScriptTemplatesRootPath: javascriptTemplatesRootPath,
		NodeDirectoryName:           nodeDirectoryName,
		Data:                        data,
	}
}

// CreateKubernetesFiles creates required directory and copies files from language template.
func (c Copier) CreateKubernetesFiles() error {
	destKubernetesDirectory := c.NodeDirectoryName + Path
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}

	var filePaths []string
	if c.IsServer {
		// copy service files to generated kubernetes manifests
		targetKubernetesServiceFileName := c.NodeDirectoryName + Path + "/" + ServiceFile
		_, err := utils.CopyFile(targetKubernetesServiceFileName, c.JavaScriptTemplatesRootPath+Path+"/"+ServiceFile)
		if err != nil {
			return err
		}
		filePaths = append(filePaths, targetKubernetesServiceFileName)
	}
	// copy deployment files to generated kubernetes manifests
	targetKubernetesDeploymentFileName := c.NodeDirectoryName + Path + "/" + DeploymentFile
	_, err := utils.CopyFile(targetKubernetesDeploymentFileName, c.JavaScriptTemplatesRootPath+Path+"/"+DeploymentFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetKubernetesDeploymentFileName)
	return executor.Execute(filePaths, c.Data)
}
