package githubactions

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const CIFile = "ci.yml.tmpl"
const ReleaseFile = "release.yml.tmpl"
const Path = "/.github/workflows"

// Copier integrations specific copier
type Copier struct {
	ProjectDirectoryName string
	NodeDirectoryName    string
	NodeName             string
	TemplatesRootPath    string
	Data                 map[string]interface{}
}

func NewCopier(userName, repositoryName, projectDirectoryName, nodeName, nodeDirectoryName, templatesRootPath string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	return &Copier{
		TemplatesRootPath:    templatesRootPath,
		NodeDirectoryName:    nodeDirectoryName,
		NodeName:             nodeName,
		ProjectDirectoryName: projectDirectoryName,
		Data:                 data,
	}
}

// CreateYamls creates required file from language template.
func (c Copier) CreateYamls() error {
	destGithubActionsDirectory := c.ProjectDirectoryName + Path
	if err := utils.CreateDirectories(destGithubActionsDirectory); err != nil {
		return err
	}

	err := c.createReleaseYaml()
	if err != nil {
		return err
	}
	err = c.createCIYaml()
	if err != nil {
		return err
	}
	return nil
}

// createCIYaml creates required file from language template.
func (c Copier) createCIYaml() error {
	var filePaths []string
	// copy ci.yaml
	targetCIYamlName := c.ProjectDirectoryName + Path + "/" + c.NodeName + "-" + CIFile
	_, err := utils.CopyFile(targetCIYamlName, c.TemplatesRootPath+Path+"/"+CIFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetCIYamlName)
	return executor.ExecuteGhActions(filePaths, c.Data)
}

// createReleaseYaml creates required file from language template.
func (c Copier) createReleaseYaml() error {
	var filePaths []string
	// copy release.yaml
	targetReleaseFileName := c.ProjectDirectoryName + Path + "/" + c.NodeName + "-" + ReleaseFile
	_, err := utils.CopyFile(targetReleaseFileName, c.TemplatesRootPath+Path+"/"+ReleaseFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetReleaseFileName)
	return executor.ExecuteGhActions(filePaths, c.Data)
}
