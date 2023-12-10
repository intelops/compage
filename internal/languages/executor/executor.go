package executor

import (
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"os"
	"strings"
	"text/template"
)

var tmpl = template.New("").Option("missingkey=error")
var ghActionsTmpl = template.New("").Option("missingkey=error").Delims("[[", "]]")

func ExecuteWithFuncs(filePaths []*string, data map[string]interface{}, funcMap template.FuncMap) error {
	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(tmpl.ParseFiles(*filePathName)).Funcs(funcMap)
		// generate go code now
		fileName := (*filePathName)[strings.LastIndex(*filePathName, utils.SubstrString)+1:]
		createdFile, err := os.Create(strings.TrimSuffix(*filePathName, utils.TemplateExtension))
		if err != nil {
			log.Errorf("error while creating the file [" + err.Error() + "]" + *filePathName)
			return err
		}
		if err0 := parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err0 != nil {
			log.Errorf("error while executing the template [" + err0.Error() + "]" + *filePathName)
			return err0
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(*filePathName, ".tmpl") {
			if err := os.Remove(*filePathName); err != nil {
				log.Errorf("error while removing the template file [" + err.Error() + "]" + *filePathName)
				return err
			}
		}
	}
	return nil
}

func Execute(filePaths []*string, data map[string]interface{}) error {
	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(tmpl.ParseFiles(*filePathName))
		// generate go code now
		fileName := (*filePathName)[strings.LastIndex(*filePathName, utils.SubstrString)+1:]
		createdFile, err := os.Create(strings.TrimSuffix(*filePathName, utils.TemplateExtension))
		if err != nil {
			log.Errorf("error while creating the file [" + err.Error() + "]" + *filePathName)
			return err
		}
		if err0 := parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err0 != nil {
			log.Errorf("error while executing the template [" + err0.Error() + "]" + *filePathName)
			return err0
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(*filePathName, ".tmpl") {
			if err := os.Remove(*filePathName); err != nil {
				log.Errorf("error while removing the template file [" + err.Error() + "]" + *filePathName)
				return err
			}
		}
	}
	return nil
}

func ExecuteGhActions(filePaths []*string, data map[string]interface{}) error {
	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(ghActionsTmpl.ParseFiles(*filePathName))
		// generate go code now
		fileName := (*filePathName)[strings.LastIndex(*filePathName, utils.SubstrString)+1:]
		createdFile, err := os.Create(strings.TrimSuffix(*filePathName, utils.TemplateExtension))
		if err != nil {
			log.Errorf("error while creating the file [" + err.Error() + "]" + *filePathName)
			return err
		}
		if err0 := parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err0 != nil {
			log.Errorf("error while executing the template [" + err0.Error() + "]" + *filePathName)
			return err0
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(*filePathName, ".tmpl") {
			if err := os.Remove(*filePathName); err != nil {
				log.Errorf("error while removing the template file [" + err.Error() + "]" + *filePathName)
				return err
			}
		}
	}
	return nil
}
