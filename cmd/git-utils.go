package cmd

import (
	"errors"
	"github.com/go-git/go-git/v5"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"os"
)

func CloneOrPullRepository(language string) error {
	repoURL, repositoryPath, err := getRepositoryURLByLanguage(language)
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	if repoURL == "" || repositoryPath == "" {
		log.Errorf("language %s not supported", language)
		return errors.New("language not supported")
	}

	exists, err := utils.DirectoryExists(repositoryPath)
	if err != nil {
		log.Errorf("error checking directory existence: %v", err)
		return err
	}
	if exists {
		log.Debugf("directory %s exists.\n", repositoryPath)
		return pullExistingRepository(repositoryPath)
	}
	log.Debugf("directory %s does not exist.\n", repositoryPath)
	log.Infof("cloning repository %s into %s\n", repoURL, repositoryPath)
	return cloneNewRepository(repoURL, repositoryPath)
}

func getRepositoryURLByLanguage(language string) (string, string, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		return "", "", err
	}
	repositoryPath := userHomeDir + "/.compage/templates/compage-template-" + language
	repositoryURL := "https://github.com/intelops/compage-template-" + language + ".git"
	if language == "common" {
		repositoryPath = userHomeDir + "/.compage/templates/common-templates"
		return "https://github.com/intelops/common-templates.git", repositoryPath, nil
	}
	return repositoryURL, repositoryPath, nil
}

func cloneNewRepository(repoURL string, cloneDir string) error {
	_, err := git.PlainClone(cloneDir, false, &git.CloneOptions{
		URL:      repoURL,
		Progress: os.Stdout,
	})
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	log.Infof("repository[%s] cloned successfully.", repoURL)
	return nil
}

func pullExistingRepository(existingRepositoryPath string) error {
	r, err := git.PlainOpen(existingRepositoryPath)
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	// Get the working directory for the repository
	w, err := r.Worktree()
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	// Pull the latest changes from the origin remote and merge into the current branch
	log.Info("git pull origin")
	err = w.Pull(&git.PullOptions{RemoteName: "origin"})
	if err != nil {
		if errors.Is(err, git.NoErrAlreadyUpToDate) {
			// This is a special error that means we don't have any new changes
			log.Info(err)
			return nil
		}
		log.Errorf("error:%v", err)
		return err
	}
	// Print the latest commit that was just pulled
	ref, err := r.Head()
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	commit, err := r.CommitObject(ref.Hash())
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	log.Info(commit)
	return nil
}
