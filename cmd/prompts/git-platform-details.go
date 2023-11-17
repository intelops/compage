package prompts

import (
	log "github.com/sirupsen/logrus"
)

type GitPlatformDetails struct {
	PlatformName     string
	PlatformURL      string
	PlatformUserName string
	RepositoryName   string
}

func GetGitPlatformDetails() (*GitPlatformDetails, error) {
	platformName, err := GetInputString("Git Platform Name", "github")
	if err != nil {
		log.Errorf("platformName prompt failed %v\n", err)
		return nil, err
	}

	platformURL, err := GetInputURLString("Git Platform URL", "https://github.com")
	if err != nil {
		log.Errorf("platformURL prompt failed %v\n", err)
		return nil, err
	}

	platformUserName, err := GetInputString("Git Platform UserName", "mygithubusername")
	if err != nil {
		log.Errorf("platformUserName prompt failed %v\n", err)
		return nil, err
	}

	repositoryName, err := GetInputString("Git Repository Name", "sample-repo")
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
