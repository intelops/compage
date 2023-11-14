package kubernetes

import (
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/utils"
	"strings"
)

const Path = "/kubernetes"
const DeploymentFile = "deployment.yaml.tmpl"
const ServiceFile = "service.yaml.tmpl"

// Copier integrations specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	RestServerPort    string
	IsGrpcServer      bool
	GrpcServerPort    string
}

func NewCopier(gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isGrpcServer bool, grpcServerPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"GitPlatformUserName": gitPlatformUserName,
	}

	if isRestServer {
		data["RestServerPort"] = restServerPort
	}
	data["IsRestServer"] = isRestServer

	if isGrpcServer {
		data["GrpcServerPort"] = grpcServerPort
	}
	data["IsGrpcServer"] = isGrpcServer

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		IsRestServer:      isRestServer,
		RestServerPort:    restServerPort,
		IsGrpcServer:      isGrpcServer,
		GrpcServerPort:    grpcServerPort,
		Data:              data,
	}
}

// CreateKubernetesFiles creates required directory and copies files from language template.
func (c Copier) CreateKubernetesFiles() error {
	destKubernetesDirectory := c.NodeDirectoryName + Path
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}

	var filePaths []*string
	if c.IsRestServer || c.IsGrpcServer {
		// copy service files to generated kubernetes manifests
		targetKubernetesServiceFileName := c.NodeDirectoryName + Path + "/" + ServiceFile
		_, err := utils.CopyFile(targetKubernetesServiceFileName, c.TemplatesRootPath+Path+"/"+ServiceFile)
		if err != nil {
			return err
		}
		filePaths = append(filePaths, &targetKubernetesServiceFileName)
	}
	// copy deployment files to generated kubernetes manifests
	targetKubernetesDeploymentFileName := c.NodeDirectoryName + Path + "/" + DeploymentFile
	_, err := utils.CopyFile(targetKubernetesDeploymentFileName, c.TemplatesRootPath+Path+"/"+DeploymentFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, &targetKubernetesDeploymentFileName)
	return executor.Execute(filePaths, c.Data)
}
