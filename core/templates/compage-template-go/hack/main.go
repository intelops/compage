package main

import (
	log "github.com/sirupsen/logrus"
	"os"
	"path/filepath"
	"strings"
)

func listProjectFiles(projectDirectoryPath string) []string {
	var files []string
	err := filepath.Walk(projectDirectoryPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !IgnorablePaths(path) && !info.IsDir() {
			files = append(files, path)
			if err2 := os.Rename(path, path+".tmpl"); err2 != nil {
				return err2
			}
		}
		return nil
	})
	if err != nil {
		log.Error(err)
	}
	return files
}

func getIgnorablePaths() []string {
	return []string{".git", ".keep", "hack", ".keep", ".idea", "{{.NodeName}}"}
}

func IgnorablePaths(path string) bool {
	for _, ignorablePath := range getIgnorablePaths() {
		if strings.Contains(path, ignorablePath) {
			return true
		}
	}
	return false
}

func main() {
	files := listProjectFiles(".")
	log.Println("files : ", files)
}
