package prompts

import (
	"errors"
	"github.com/manifoldco/promptui"
	log "github.com/sirupsen/logrus"
	"regexp"
)

type ProjectDetails struct {
	ProjectName string
}

func GetProjectDetails() (*ProjectDetails, error) {
	pattern := "^[a-zA-Z_][a-zA-Z0-9_-]*$"
	validate := func(input string) error {
		if len(input) < 1 {
			return errors.New("project name cannot be empty")
		}
		// check if input is valid string for name
		regexpPattern := regexp.MustCompile(pattern)
		if !regexpPattern.MatchString(input) {
			return errors.New("invalid project name")
		}
		return nil
	}

	prompt := promptui.Prompt{
		Label:    "Project Name",
		Default:  "compage-project",
		Validate: validate,
	}

	result, err := prompt.Run()

	if err != nil {
		log.Errorf("Prompt failed %v\n", err)
		return nil, err
	}

	projectDetails := &ProjectDetails{
		ProjectName: result,
	}
	return projectDetails, nil
}
