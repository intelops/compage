package readme

import (
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
)

const File = "README.md.tmpl"

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
		// TODO change this path to constant. Add language specific analysers in a generic way later.
		TemplatesRootPath:    utils.GetProjectRootPath("templates/common-templates"),
		ProjectDirectoryName: utils.GetProjectDirectoryName(project.Name),
		RepositoryName:       project.RepositoryName,
		Data:                 data,
	}
}

// CreateReadMeFile creates required directory and copies files from language template.
func (c Copier) CreateReadMeFile() error {
	destDirectory := c.ProjectDirectoryName
	if err := utils.CreateDirectories(destDirectory); err != nil {
		return err
	}

	var filePaths []string
	// copy deployment files to generated deepsource config files
	targetReadMeFileName := c.ProjectDirectoryName + "/" + File
	_, err := utils.CopyFile(targetReadMeFileName, c.TemplatesRootPath+"/"+File)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetReadMeFileName)
	return executor.Execute(filePaths, c.Data)
}
