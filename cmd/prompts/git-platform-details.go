package prompts

import (
	"errors"
	"github.com/manifoldco/promptui"
	log "github.com/sirupsen/logrus"
	"regexp"
)

type GitPlatformDetails struct {
	PlatformName     string
	PlatformURL      string
	PlatformUserName string
	RepositoryName   string
}

const pattern = "^[a-zA-Z_][a-zA-Z0-9_-]*$"

func validateStringInput(input string) error {
	// check if input is valid string or not
	regexpPattern := regexp.MustCompile(pattern)
	if !regexpPattern.MatchString(input) {
		return errors.New("invalid input")
	}
	return nil
}

func getInput(label, defaultValue string) (string, error) {
	// get platform name
	prompt := promptui.Prompt{
		Label:    label,
		Default:  defaultValue,
		Validate: validateStringInput,
	}

	return prompt.Run()
}

func GetGitPlatformDetails() (*GitPlatformDetails, error) {
	platformName, err := getInput("Git Platform Name", "github")
	if err != nil {
		log.Errorf("platformName prompt failed %v\n", err)
		return nil, err
	}

	platformURL, err := getInput("Git Platform URL", "https://github.com")
	if err != nil {
		log.Errorf("platformURL prompt failed %v\n", err)
		return nil, err
	}

	platformUserName, err := getInput("Git Platform UserName", "mygithubusername")
	if err != nil {
		log.Errorf("platformUserName prompt failed %v\n", err)
		return nil, err
	}

	repositoryName, err := getInput("Git Repository Name", "sample-repo")
	if err != nil {
		log.Errorf("repositoryName prompt failed %v\n", err)
		return nil, err
	}

	gitPlatformDetails := &GitPlatformDetails{
		PlatformName:     platformName,
		PlatformURL:      platformURL,
		PlatformUserName: platformUserName,
		RepositoryName:   repositoryName,
	}
	return gitPlatformDetails, nil
}
