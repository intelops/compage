package generator

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/utils"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

const templateExtension = ".tmpl"
const templateExtensionPattern = "/*" + templateExtension
const substrString = "/"

// Root directory of template files
const templatesPath = "./templates"

// ParseTemplates parse.go
func ParseTemplates(templatesPath string) (*template.Template, []string, error) {
	var directories []string
	var filePaths []string

	// Get all directories on /templates and check if there's repeated files
	err := filepath.Walk(templatesPath, func(path string, info os.FileInfo, err error) error {
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
	if err != nil {
		return nil, nil, err
	}

	// a template for parsing all directories
	// The below line requires to have .tmpl file in every folder, so not using parseBlob because of that.
	//tmpl := template.Must(template.ParseGlob(templatesPath + templateExtensionPattern))
	tmpl := template.Must(template.ParseFiles(filePaths...))

	// Parse all directories (minus the templatesPath directory)
	for _, path := range directories[1:] {
		gotTemplates, err2 := hasTemplates(path)
		if err2 != nil {
			return nil, nil, err2
		}
		if gotTemplates {
			pattern := path + templateExtensionPattern
			template.Must(tmpl.ParseGlob(pattern))
		}
	}

	return tmpl, filePaths, nil
}

func contains(filePaths []string, filePathName string) bool {
	for _, f := range filePaths {
		if f == filePathName {
			return true
		}
	}
	return false
}

// TemplateRunner runs templates parser to generate a project with config passed
func TemplateRunner(nodeDirectoryName string, data map[string]string) error {
	parsedTemplates, filePaths, err := ParseTemplates(templatesPath)
	if err != nil {
		return err
	}
	for _, filePathName := range filePaths {
		if !utils.IgnorablePaths(filePathName) {
			fileNameDirectoryPath := nodeDirectoryName + "/" + filePathName[:strings.LastIndex(filePathName, substrString)]
			//fileNameDirectoryPath := nodeDirectoryName + "/" + filePathName[strings.LastIndex(filePathName, substrString)+1:]
			if fileNameDirectoryPath != "" {
				err = os.MkdirAll(fileNameDirectoryPath, os.ModePerm)
				if err != nil {
					return err
				}
			}
			fileName := filePathName[strings.LastIndex(filePathName, substrString)+1:]
			createdFile, err2 := os.Create(nodeDirectoryName + "/" + strings.TrimSuffix(filePathName, templateExtension))
			if err2 != nil {
				return err2
			}
			if err2 = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err2 != nil {
				return err2
			}
		}
	}
	return nil
}

func hasTemplates(directoryName string) (bool, error) {
	d, err := os.Open(directoryName)
	if err != nil {
		return false, err
	}
	defer func(d *os.File) {
		_ = d.Close()
	}(d)

	files, err := d.Readdir(-1)
	if err != nil {
		return false, err
	}

	for _, file := range files {
		if file.Mode().IsRegular() {
			if filepath.Ext(file.Name()) == templateExtension {
				return true, nil
			}
		}
	}
	return false, nil
}
