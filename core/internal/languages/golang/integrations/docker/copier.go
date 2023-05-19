package docker

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
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
	IsGrpcServer      bool
	GrpcServerPort    string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isGrpcServer bool, grpcServerPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
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

// CreateDockerFile creates required file from language template.
func (c Copier) CreateDockerFile() error {
	var filePaths []string
	// copy dockerfile
	targetDockerFileName := c.NodeDirectoryName + "/" + File
	_, err := utils.CopyFile(targetDockerFileName, c.TemplatesRootPath+"/"+File)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetDockerFileName)
	return executor.Execute(filePaths, c.Data)
}
