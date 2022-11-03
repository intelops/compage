package generator

import (
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/utils"
)

func Generate(project *core.Project) error {
	projectDirectory, err := utils.CreateProjectDirectory(project.Name)
	if err != nil {
		return err
	}
	return runTemplates(project, projectDirectory)
}

func runTemplates(project *core.Project, projectDirectory string) error {
	config := map[string]string{
		"Name":      "John Doe",
		"Job":       "Software Engineer",
		"Education": "BTech",
	}
	err := TemplateRunner(projectDirectory, config)
	if err != nil {
		return err
	}

	return utils.CreateTarFile(project.Name, projectDirectory)
}
