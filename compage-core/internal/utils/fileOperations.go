package utils

import (
	"archive/tar"
	"bytes"
	"compress/gzip"
	"github.com/kube-tarian/compage-core/internal/utils/file"
	log "github.com/sirupsen/logrus"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// GetProjectTarFileName returns tarFile name
func GetProjectTarFileName(name string) string {
	return strings.ToLower(name) + FileExtension
}

// GetProjectTarFilePath returns tarFile path
func GetProjectTarFilePath(name string) string {
	return GetProjectDirectoryName(name) + "/" + GetProjectTarFileName(name)
}

// GetProjectDirectoryName returns tarFile parent path
func GetProjectDirectoryName(name string) string {
	return DownloadPath + "/" + strings.ToLower(name)
}

// CreateProjectDirectory creates a directory with project name
func CreateProjectDirectory(name string) (string, error) {
	dirName := GetProjectDirectoryName(name)
	if err := os.MkdirAll(dirName, os.ModePerm); err != nil {
		return "", err
	}
	return dirName, nil
}

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

func listProjectFiles(projectDirectoryPath string) []string {
	var files []string
	err := filepath.Walk(projectDirectoryPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Error(err)
			return err
		}
		if !ignorablePaths(path) && !info.IsDir() {
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

func ignorablePaths(path string) bool {
	return strings.Contains(path, ".git") || strings.Contains(path, ".idea")
}

func GetFile(tarFilePath string) (*file.File, bool) {
	if tarFilePath == "" {
		return nil, false
	}
	data, err := os.ReadFile(tarFilePath)
	if err != nil {
		return nil, false
	}
	return file.NewFile(tarFilePath, "tar.gz", len(data), bytes.NewReader(data)), true
}
