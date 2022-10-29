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
	defer func(file *os.File) {
		_ = file.Close()
	}(file)

	n, err := file.Write([]byte("mahendra intelops"))
	if err != nil {
		return err
	}
	log.Debug("file created successfully and written with %v bytes", n)

	return utils.CreateTarFile(project.Name, projectDirectory)
}
