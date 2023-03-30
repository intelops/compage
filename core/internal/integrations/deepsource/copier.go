package deepsource

import (
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
)

const TomlFile = ".deepsource.toml.tmpl"

// Copier integrations specific copier
type Copier struct {
	ProjectDirectoryName string
	RepositoryName       string
	TemplatesRootPath    string
	Data                 map[string]interface{}
}

func NewCopier(project *core.Project) *Copier {
	// retrieve project named directory
	//userName, repositoryName, projectDirectoryName, templatesRootPath string
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": project.RepositoryName,
		"UserName":       project.UserName,
	}

	return &Copier{
		// TODO change this to generic integration path
		TemplatesRootPath:    utils.GetProjectRootPath("templates/compage-template-go"),
		ProjectDirectoryName: utils.GetProjectDirectoryName(project.Name),
		RepositoryName:       project.RepositoryName,
		Data:                 data,
	}
}

// CreateDeepSourceFiles creates required directory and copies files from language template.
func (c Copier) CreateDeepSourceFiles() error {
	destDirectory := c.ProjectDirectoryName
	if err := utils.CreateDirectories(destDirectory); err != nil {
		return err
	}

	var filePaths []string
	// copy deployment files to generated deepsource config files
	targetDeepSourceTomlFileName := c.ProjectDirectoryName + "/" + TomlFile
	_, err := utils.CopyFile(targetDeepSourceTomlFileName, c.TemplatesRootPath+"/"+TomlFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetDeepSourceTomlFileName)
	return executor.Execute(filePaths, c.Data)
}
