package executor

import (
	"github.com/intelops/compage/core/internal/utils"
	"os"
	"strings"
	"text/template"
)

func Execute(filePaths []string, data map[string]interface{}) error {
	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(template.New("").Option("missingkey=zero").ParseFiles(filePathName))
		// generate go code now
		fileName := filePathName[strings.LastIndex(filePathName, utils.SubstrString)+1:]
		createdFile, err := os.Create(strings.TrimSuffix(filePathName, utils.TemplateExtension))
		if err != nil {
			return err
		}
		if err0 := parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err0 != nil {
			return err0
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(filePathName, ".tmpl") {
			if err := os.Remove(filePathName); err != nil {
				return err
			}
		}
	}
	return nil
}
