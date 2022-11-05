package generator

import (
	"fmt"
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
	tmpl := template.Must(template.ParseGlob(templatesPath + templateExtensionPattern))

	// Parse all directories (minus the templatesPath directory)
	for _, path := range directories[1:] {
		pattern := path + templateExtensionPattern
		template.Must(tmpl.ParseGlob(pattern))
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
func TemplateRunner(parentDirectoryName string, data map[string]string) error {
	parsedTemplates, filePaths, err := ParseTemplates(templatesPath)
	if err != nil {
		return err
	}
	for _, filePathName := range filePaths {
		fileNameDirectoryPath := parentDirectoryName + filePathName[:strings.LastIndex(filePathName, substrString)]
		if fileNameDirectoryPath != "" {
			err = os.MkdirAll(fileNameDirectoryPath, os.ModePerm)
			if err != nil {
				return err
			}
		}
		fileName := filePathName[strings.LastIndex(filePathName, substrString)+1:]
		createdFile, err := os.Create(parentDirectoryName + strings.TrimSuffix(filePathName, templateExtension))
		if err != nil {
			return err
		}
		if err = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err != nil {
			return err
		}
	}
	return nil
}
