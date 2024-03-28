package models

import (
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v3"
	"os"
)

type Repository struct {
	Name string `yaml:"name,omitempty"`
	URL  string `yaml:"url,omitempty"`
}

type Platform struct {
	Name     string `yaml:"name,omitempty"`
	URL      string `yaml:"url,omitempty"`
	UserName string `yaml:"userName,omitempty"`
}

type GitDetails struct {
	Repository Repository `yaml:"repository,omitempty"`
	Platform   Platform   `yaml:"platform,omitempty"`
}

type Project struct {
	Name            string                 `yaml:"name"`
	Version         string                 `yaml:"version"`
	GitDetails      GitDetails             `yaml:"git"`
	CompageJSON     map[string]interface{} `yaml:"compageJSON"`
	ProjectMetadata string                 `yaml:"projectMetadata"`
}

func ReadConfigYAMLFile(configFile string) (*Project, error) {
	data, err := os.ReadFile(configFile)
	if err != nil {
		log.Errorf("error reading config file: %v", err)
		return nil, err
	}

	var project Project
	// Unmarshal YAML data into the provided struct
	if err := yaml.Unmarshal(data, &project); err != nil {
		log.Errorf("error unmarshalling YAML data: %v", err)
		return nil, err
	}

	return &project, nil
}
