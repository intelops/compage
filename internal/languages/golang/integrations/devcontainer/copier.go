package devcontainer

import (
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/utils"
	"strings"
)

const JSONFile = "devcontainer.json.tmpl"
const DockerfileFile = "Dockerfile.tmpl"
const Path = "/.devcontainer"

// Copier integrations specific copier
type Copier struct {
	ProjectName       string
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	RestServerPort    string
	IsGrpcServer      bool
	GrpcServerPort    string
}

func NewCopier(gitPlatformUserName,
	gitRepositoryName, projectName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isGrpcServer bool, grpcServerPort string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"ProjectName":         projectName,
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"GitPlatformUserName": gitPlatformUserName,
	}

	data["RestServerPort"] = restServerPort
	data["IsRestServer"] = isRestServer

	data["GrpcServerPort"] = grpcServerPort
	data["IsGrpcServer"] = isGrpcServer

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		ProjectName:       projectName,
		NodeDirectoryName: nodeDirectoryName,
		IsRestServer:      isRestServer,
		RestServerPort:    restServerPort,
		IsGrpcServer:      isGrpcServer,
		GrpcServerPort:    grpcServerPort,
		Data:              data,
	}
}

// CreateDevContainerConfigs creates required file from devcontainer.
func (c Copier) CreateDevContainerConfigs() error {
	destDevContainerDirectory := c.NodeDirectoryName + Path
	if err := utils.CreateDirectories(destDevContainerDirectory); err != nil {
		return err
	}

	var filePaths []*string

	// copy devcontainer.json
	targetDevContainerJSONName := c.NodeDirectoryName + Path + "/" + JSONFile
	const DevContainerSrcPath = "/.devcontainer/"
	_, err := utils.CopyFile(targetDevContainerJSONName, c.TemplatesRootPath+DevContainerSrcPath+JSONFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, &targetDevContainerJSONName)

	// copy Dockerfile
	targetDockerFileName := c.NodeDirectoryName + Path + "/" + DockerfileFile
	_, err = utils.CopyFile(targetDockerFileName, c.TemplatesRootPath+DevContainerSrcPath+DockerfileFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, &targetDockerFileName)

	return executor.Execute(filePaths, c.Data)
}
