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
		createdFile, err2 := os.Create(strings.TrimSuffix(filePathName, utils.TemplateExtension))
		if err2 != nil {
			return err2
		}
		if err2 = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err2 != nil {
			return err2
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(filePathName, ".tmpl") {
			if err2 := os.Remove(filePathName); err2 != nil {
				return err2
			}
		}
	}
	return nil
}
