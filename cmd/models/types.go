package models

import (
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

type CompageJSON struct {
}

type Project struct {
	Name            string                 `yaml:"name"`
	GitDetails      GitDetails             `yaml:"git"`
	CompageJSON     map[string]interface{} `yaml:"compageJSON"`
	ProjectMetadata string                 `yaml:"projectMetadata"`
}

func ReadConfigYAMLFile(configFile string) (*Project, error) {
	data, err := os.ReadFile(configFile)
	if err != nil {
		return nil, err
	}

	var project Project
	// Unmarshal YAML data into the provided struct
	if err := yaml.Unmarshal(data, &project); err != nil {
		return nil, err
	}

	return &project, nil
}
