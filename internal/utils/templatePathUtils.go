package utils

import (
	log "github.com/sirupsen/logrus"
	"os"
)

func GetBaseTemplateRootPath() (string, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		log.Errorf("error while getting the user home directory [" + err.Error() + "]")
		return "", err
	}
	templatesDirectoryPath := userHomeDir + "/.compage/templates"
	return templatesDirectoryPath, nil
}

// GetTemplatesRootPath returns a root path of the language template passed.
func GetTemplatesRootPath(languageTemplateDirectoryName, version string) (string, error) {
	baseTemplateRootPath, err := GetBaseTemplateRootPath()
	if err != nil {
		log.Errorf("error while getting the base template root path [" + err.Error() + "]")
		return "", err
	}
	return baseTemplateRootPath + "/" + languageTemplateDirectoryName + "/" + version, nil
}
