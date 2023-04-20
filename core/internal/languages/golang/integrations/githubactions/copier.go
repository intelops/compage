package githubactions

import (
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const CIFile = "ci.yml.tmpl"
const ReleaseFile = "release.yml.tmpl"

// Copier integrations specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
	}
}

// CreateYamls creates required file from language template.
func (c Copier) CreateYamls() error {
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
	targetCIYamlName := c.NodeDirectoryName + "/" + CIFile
	_, err := utils.CopyFile(targetCIYamlName, c.TemplatesRootPath+"/"+CIFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetCIYamlName)
	return executor.Execute(filePaths, c.Data)
}

// createReleaseYaml creates required file from language template.
func (c Copier) createReleaseYaml() error {
	var filePaths []string
	// copy release.yaml
	targetReleaseFileName := c.NodeDirectoryName + "/" + ReleaseFile
	_, err := utils.CopyFile(targetReleaseFileName, c.TemplatesRootPath+"/"+ReleaseFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetReleaseFileName)
	return executor.Execute(filePaths, c.Data)
}
