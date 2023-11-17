package prompts

import (
	log "github.com/sirupsen/logrus"
)

type ProjectDetails struct {
	ProjectName string
}

func GetProjectDetails() (*ProjectDetails, error) {
	result, err := GetInputString("Project Name", "myproject")
	if err != nil {
		log.Errorf("Prompt failed %v\n", err)
		return nil, err
	}

	projectDetails := &ProjectDetails{
		ProjectName: result,
	}
	return projectDetails, nil
}
