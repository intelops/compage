package taroperations

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"github.com/intelops/compage/core/internal/utils"
	log "github.com/sirupsen/logrus"
	"io"
	"os"
	"path/filepath"
	"strings"
)

const FileExtension = ".tar.gz"

// GetProjectTarFileName returns tarFile name for project.
func GetProjectTarFileName(name string) string {
	return strings.ToLower(name) + FileExtension
}

// GetProjectTarFilePath returns tarFile path for project.
func GetProjectTarFilePath(name string) string {
	return utils.GetProjectDirectoryName(name) + "/" + GetProjectTarFileName(name)
}

// CreateTarFile creates tar file for project.
func CreateTarFile(projectName, projectDirectory string) error {
	projectFiles := listProjectFiles(projectDirectory)
	projectTarFileName := GetProjectTarFilePath(projectName)
	outFile, err := os.Create(projectTarFileName)
	if err != nil {
		_ = os.Remove(projectTarFileName)
		log.Error("error creating archive file")
		return err
	}
	defer func(outFile *os.File) {
		_ = outFile.Close()
	}(outFile)
	err = createTarAndGz(projectFiles, outFile)
	if err != nil {
		_ = os.Remove(projectTarFileName)
		log.Error("error creating an archive file." + err.Error())
		return err
	}
	log.Debug("archiving and file compression completed.")
	return nil
}

// createTarAndGz creates tar/zip of project files.
func createTarAndGz(projectFiles []string, buffer io.Writer) error {
	gzipWriter := gzip.NewWriter(buffer)
	defer func(gzipWriter *gzip.Writer) {
		_ = gzipWriter.Close()
	}(gzipWriter)
	tarWriter := tar.NewWriter(gzipWriter)
	defer func(tarWriter *tar.Writer) {
		_ = tarWriter.Close()
	}(tarWriter)
	for _, f := range projectFiles {
		err := addToTar(tarWriter, f)
		if err != nil {
			log.Error(err)
			return err
		}
	}
	return nil
}

// addToTar adds files to tar.
func addToTar(tarWriter *tar.Writer, filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		log.Error(err)
		return err
	}
	defer func(file *os.File) {
		_ = file.Close()
	}(f)
	info, err := f.Stat()
	if err != nil {
		log.Error(err)
		return err
	}
	header, err := tar.FileInfoHeader(info, info.Name())
	if err != nil {
		log.Error(err)
		return err
	}
	header.Name = filename
	err = tarWriter.WriteHeader(header)
	if err != nil {
		log.Error(err)
		return err
	}
	_, err = io.Copy(tarWriter, f)
	if err != nil {
		log.Error(err)
		return err
	}

	return nil
}

// listProjectFiles list all files on projectDirectoryPath.
func listProjectFiles(projectDirectoryPath string) []string {
	var files []string
	err := filepath.Walk(projectDirectoryPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !utils.IgnorablePaths(path) && !info.IsDir() {
			//TODO Needs to fix problem with below impl as it searches in current dir
			//files = append(files, strings.Replace(path, projectDirectoryPath, "", -1))
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		log.Error(err)
	}
	return files
}

// GetFile returns file for name supplied.
func GetFile(tarFilePath string) (*File, bool) {
	if tarFilePath == "" {
		return nil, false
	}
	data, err := os.ReadFile(tarFilePath)
	if err != nil {
		return nil, false
	}
	return NewFile(tarFilePath, "tar.gz", len(data), bytes.NewReader(data)), true
}
