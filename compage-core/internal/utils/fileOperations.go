package utils

import (
	"archive/tar"
	"compress/gzip"
	"io"
	"os"
	"strings"
)

func GetTarFileName(name string) string {
	return strings.ToLower(name) + FileExtension
}

func GetTarFilePath(name string) string {
	return GetDirName(name) + "/" + GetTarFileName(name)
}

func GetDirName(name string) string {
	return DownloadPath + strings.ToLower(name)
}

func CreateArchive(files []string, buf io.Writer) error {
	// Create new Writers for gzip and tar
	// These writers are chained. Writing to the tar writer will
	// write to the gzip writer which in turn will write to
	// the "buf" writer
	gw := gzip.NewWriter(buf)
	defer func(gw *gzip.Writer) {
		_ = gw.Close()
	}(gw)
	tw := tar.NewWriter(gw)
	defer func(tw *tar.Writer) {
		_ = tw.Close()
	}(tw)

	// Iterate over files and add them to the tar archive
	for _, file := range files {
		if err := addToArchive(tw, file); err != nil {
			return err
		}
	}

	return nil
}

func addToArchive(tw *tar.Writer, filename string) error {
	// Open the file which will be written into the archive
	file, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer func(file *os.File) {
		_ = file.Close()
	}(file)

	// Get FileInfo about our file providing file size, mode, etc.
	info, err := file.Stat()
	if err != nil {
		return err
	}

	// Create a tar Header from the FileInfo data
	header, err := tar.FileInfoHeader(info, info.Name())
	if err != nil {
		return err
	}

	// Use full path as name (FileInfoHeader only takes the basename)
	// If we don't do this the directory strucuture would
	// not be preserved
	// https://golang.org/src/archive/tar/common.go?#L626
	header.Name = filename

	// Write file header to the tar archive
	err = tw.WriteHeader(header)
	if err != nil {
		return err
	}

	// Copy file content to tar archive
	_, err = io.Copy(tw, file)
	if err != nil {
		return err
	}

	return nil
}

func CreateDirectory(name string) (string, error) {
	dirName := GetDirName(name)
	if err := os.MkdirAll(dirName, os.ModePerm); err != nil {
		return "", err
	}
	return dirName, nil
}

func CreateTarFile(name string) {

}
