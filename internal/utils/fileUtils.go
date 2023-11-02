package utils

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// GetProjectDirectoryName returns tarFile parent path
func GetProjectDirectoryName(name string) string {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		log.Debugf("Error getting user home directory: %s", err)
		panic(err)
	}
	return userHomeDir + CodeGeneratorPath + "/" + name
}

// CreateDirectories creates the directory specified and all other directories in the path.
func CreateDirectories(dirName string) error {
	return os.MkdirAll(dirName, os.ModePerm)
}

// CopyFiles copies only file in the srcDirectory to destDirectory, doesn't do it recursively.
func CopyFiles(destDirectory string, srcDirectory string) error {
	return CopyAllInSrcDirToDestDir(destDirectory, srcDirectory, false)
}

// CopyFilesAndDirs copies files and dirs in the srcDirectory to destDirectory, does it recursively.
func _(destDirectory string, srcDirectory string) error {
	return CopyAllInSrcDirToDestDir(destDirectory, srcDirectory, true)
}

// CopyAllInSrcDirToDestDir copies content of srcDirectory to destDirectory based on flag copyNestedDir
func CopyAllInSrcDirToDestDir(destDirectory, srcDirectory string, copyNestedDir bool) error {
	openedDir, err := os.Open(srcDirectory)
	if err != nil {
		return err
	}

	fileInfo, err := openedDir.Stat()
	if err != nil {
		return err
	}
	if !fileInfo.IsDir() {
		return fmt.Errorf("Source " + fileInfo.Name() + " is not a directory!")
	}

	if err0 := os.Mkdir(destDirectory, 0755); err0 != nil && !os.IsExist(err0) {
		return err0
	}

	files, err := os.ReadDir(srcDirectory)
	if err != nil {
		return err
	}
	for _, file := range files {
		if !file.IsDir() {
			_, err0 := CopyFile(destDirectory+"/"+file.Name(), srcDirectory+"/"+file.Name())
			if err0 != nil {
				return err0
			}
		} else if copyNestedDir {
			err0 := CopyAllInSrcDirToDestDir(destDirectory+"/"+file.Name(), srcDirectory+"/"+file.Name(), copyNestedDir)
			if err0 != nil {
				return err0
			}
		}
	}
	return nil
}

// CopyFile copies src file to dest
func CopyFile(destFilePath, srcFilePath string) (int64, error) {
	srcFileStat, err := os.Stat(srcFilePath)
	if err != nil {
		return 0, err
	}
	if !srcFileStat.Mode().IsRegular() {
		return 0, fmt.Errorf("%s is not a regular file", srcFilePath)
	}

	sourceFile, err := os.Open(srcFilePath)
	if err != nil {
		return 0, err
	}
	defer func(source *os.File) {
		_ = source.Close()
	}(sourceFile)

	destinationFile, err := os.Create(destFilePath)
	if err != nil {
		return 0, err
	}
	defer func(destination *os.File) {
		_ = destination.Close()
	}(destinationFile)
	return io.Copy(destinationFile, sourceFile)
}

// IgnorablePaths ignores a few directories.
func IgnorablePaths(path string) bool {
	return strings.HasSuffix(path, ".git") || strings.HasSuffix(path, ".idea")
}

// GetDirectoriesAndFilePaths returns files and directories in given a path or error.
func GetDirectoriesAndFilePaths(templatesPath string) ([]string, []string, error) {
	var directories []string
	var filePaths []string

	// Get all directories on /templates and check if there are repeated files
	err := filepath.Walk(templatesPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			// Is file
			filename := info.Name()
			hasRepeatedFilePaths := contains(filePaths, path)
			if hasRepeatedFilePaths {
				return fmt.Errorf("you can't have repeated template files: %s", filename)
			}
			filePaths = append(filePaths, path)
		} else {
			// Is directory
			directories = append(directories, path)
		}

		return nil
	})
	return directories, filePaths, err
}

func contains(filePaths []string, filePathName string) bool {
	for _, f := range filePaths {
		if f == filePathName {
			return true
		}
	}
	return false
}
