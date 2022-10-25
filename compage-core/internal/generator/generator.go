package generator

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/utils"
	log "github.com/sirupsen/logrus"
	"os"
	"path/filepath"
)

func Generate(project *core.Project) error {
	directory, err := utils.CreateDirectory(project.Name)
	if err != nil {
		return err
	}
	return runTemplates(project, directory)
}

func runTemplates(project *core.Project, directory string) error {
	path := filepath.Join(directory, project.Name+".txt")
	file, err := os.Create(path)
	if err != nil {
		log.Error(err)
		return err
	}
	_, _ = file.Write([]byte("mahendra intelops"))
	log.Info("File created successfully")
	defer func(file *os.File) {
		_ = file.Close()
	}(file)
	out, err := os.Create(utils.GetTarFileName(project.Name))
	if err != nil {
		log.Fatalln("Error writing archive:", err)
	}
	defer func(out *os.File) {
		_ = out.Close()
	}(out)
	// Create the archive and write the output to the "out" Writer
	if err = utils.CreateArchive([]string{file.Name()}, out); err != nil {
		return err
	}
	fmt.Println("Archive created successfully")
	return nil
}
