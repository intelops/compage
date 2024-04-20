package deepsource

import (
	"github.com/intelops/compage/internal/core"
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

const TomlFile = ".deepsource.toml.tmpl"

// Copier integrations specific copier
type Copier struct {
	ProjectDirectoryName string
	GitRepositoryName    string
	TemplatesRootPath    string
	Data                 map[string]interface{}
}

func NewCopier(project *core.Project) (*Copier, error) {
	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   project.GitRepositoryName,
		"GitPlatformUserName": project.GitPlatformUserName,
	}

	templatesRootPath, err := utils.GetTemplatesRootPath("common-templates/", project.Version)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return nil, err
	}
	return &Copier{
		// TODO change this path to constant. Add language specific analysers in a generic way later.
		TemplatesRootPath:    templatesRootPath,
		ProjectDirectoryName: utils.GetProjectDirectoryName(project.Name),
		GitRepositoryName:    project.GitRepositoryName,
		Data:                 data,
	}, nil
}

// CreateDeepSourceFiles creates required directory and copies files from language template.
func (c Copier) CreateDeepSourceFiles() error {
	destDirectory := c.ProjectDirectoryName
	if err := utils.CreateDirectories(destDirectory); err != nil {
		log.Errorf("error while creating directories [" + err.Error() + "]")
		return err
	}

	var filePaths []*string
	// copy deployment files to generated deepsource config files
	targetDeepSourceTomlFileName := c.ProjectDirectoryName + "/" + TomlFile
	_, err := utils.CopyFile(targetDeepSourceTomlFileName, c.TemplatesRootPath+"/"+TomlFile)
	if err != nil {
		log.Errorf("error while copying file [" + err.Error() + "]")
		return err
	}
	filePaths = append(filePaths, &targetDeepSourceTomlFileName)
	return executor.Execute(filePaths, c.Data)
}
