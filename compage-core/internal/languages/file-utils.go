package languages

import (
	"fmt"
	"io"
	"os"
)

func CopyFiles(destDirectory string, srcDirectory string) error {
	return CopyAllFilesInSrcDirToDestDir(destDirectory, srcDirectory, false)
}

func CopyFilesAndDirs(destDirectory string, srcDirectory string) error {
	return CopyAllFilesInSrcDirToDestDir(destDirectory, srcDirectory, true)
}

func CopyAllFilesInSrcDirToDestDir(dest, src string, copyNestedDir bool) error {
	openedDir, err := os.Open(src)
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

	if err = os.Mkdir(dest, 0755); err != nil && err != os.ErrExist {
		return err
	}

	files, err1 := os.ReadDir(src)
	if err1 != nil {
		return err1
	}
	for _, file := range files {
		if !file.IsDir() {
			_, err = CopyFile(dest+"/"+file.Name(), src+"/"+file.Name())
			if err != nil {
				return err
			}
		} else if copyNestedDir {
			err = CopyAllFilesInSrcDirToDestDir(dest+"/"+file.Name(), src+"/"+file.Name(), copyNestedDir)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func CopyFile(dst, src string) (int64, error) {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return 0, err
	}
	if !sourceFileStat.Mode().IsRegular() {
		return 0, fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer func(source *os.File) {
		_ = source.Close()
	}(source)

	destination, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer func(destination *os.File) {
		_ = destination.Close()
	}(destination)
	return io.Copy(destination, source)
}
