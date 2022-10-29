package generator

import (
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/utils"
	log "github.com/sirupsen/logrus"
	"os"
	"path/filepath"
)

func Generate(project *core.Project) error {
	projectDirectory, err := utils.CreateProjectDirectory(project.Name)
	if err != nil {
		return err
	}
	return runTemplates(project, projectDirectory)
}

func runTemplates(project *core.Project, projectDirectory string) error {
	path := filepath.Join(projectDirectory, project.Name+".txt")
	file, err := os.Create(path)
	if err != nil {
		log.Error(err)
		return err
	}
	_, _ = file.Write([]byte("mahendra intelops"))
	log.Debug("File created successfully")
	defer func(file *os.File) {
		_ = file.Close()
	}(file)

	return utils.CreateTarFile(project.Name, projectDirectory)
}
