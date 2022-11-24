package utils

import (
	"fmt"
	"io"
	"os"
	"strings"
)

// GetProjectDirectoryName returns tarFile parent path
func GetProjectDirectoryName(name string) string {
	return TmpPath + "/" + strings.ToLower(name)
}

// CreateDirectories creates the directory specified and all other directories in the path.
func CreateDirectories(dirName string) error {
	return os.MkdirAll(dirName, os.ModePerm)
}

// CopyFiles copies only files in the srcDirectory to destDirectory, doesn't do it recursively.
func CopyFiles(destDirectory string, srcDirectory string) error {
	return CopyAllInSrcDirToDestDir(destDirectory, srcDirectory, false)
}

// CopyFilesAndDirs copies files and dirs in the srcDirectory to destDirectory, does it recursively.
func CopyFilesAndDirs(destDirectory string, srcDirectory string) error {
	return CopyAllInSrcDirToDestDir(destDirectory, srcDirectory, true)
}

// CopyAllInSrcDirToDestDir copies content of srcDirectory to destDirectory based on flag copyNestedDir
func CopyAllInSrcDirToDestDir(destDirectory, srcDirectory string, copyNestedDir bool) error {
	openedDir, err := os.Open(srcDirectory)
	if err != nil {
		return err
	}

	fileInfo, err0 := openedDir.Stat()
	if err0 != nil {
		return err0
	}
	if !fileInfo.IsDir() {
		return fmt.Errorf("Source " + fileInfo.Name() + " is not a directory!")
	}

	if err = os.Mkdir(destDirectory, 0755); err != nil && !os.IsExist(err) {
		return err
	}

	files, err1 := os.ReadDir(srcDirectory)
	if err1 != nil {
		return err1
	}
	for _, file := range files {
		if !file.IsDir() {
			_, err = CopyFile(destDirectory+"/"+file.Name(), srcDirectory+"/"+file.Name())
			if err != nil {
				return err
			}
		} else if copyNestedDir {
			err = CopyAllInSrcDirToDestDir(destDirectory+"/"+file.Name(), srcDirectory+"/"+file.Name(), copyNestedDir)
			if err != nil {
				return err
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
	return strings.Contains(path, ".git") || strings.Contains(path, ".idea")
}
