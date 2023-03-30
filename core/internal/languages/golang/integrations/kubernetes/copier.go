package kubernetes

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const KubernetesPath = "/kubernetes"
const KubernetesDeploymentFile = "deployment.yaml.tmpl"
const KubernetesServiceFile = "service.yaml.tmpl"

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

// CreateKubernetesFiles creates required directory and copies files from language template.
func (c Copier) CreateKubernetesFiles() error {
	destKubernetesDirectory := c.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}

	var filePaths []string
	if c.IsServer {
		// copy service files to generated kubernetes manifests
		targetKubernetesServiceFileName := c.NodeDirectoryName + KubernetesPath + "/" + KubernetesServiceFile
		_, err := utils.CopyFile(targetKubernetesServiceFileName, c.GoTemplatesRootPath+KubernetesPath+"/"+KubernetesServiceFile)
		if err != nil {
			return err
		}
		filePaths = append(filePaths, targetKubernetesServiceFileName)
	}
	// copy deployment files to generated kubernetes manifests
	targetKubernetesDeploymentFileName := c.NodeDirectoryName + KubernetesPath + "/" + KubernetesDeploymentFile
	_, err := utils.CopyFile(targetKubernetesDeploymentFileName, c.GoTemplatesRootPath+KubernetesPath+"/"+KubernetesDeploymentFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetKubernetesDeploymentFileName)
	return executor.Execute(filePaths, c.Data)
}
