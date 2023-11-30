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
		pullExistingRepository(repositoryPath)
		return nil
	}
	log.Debugf("directory %s does not exist.\n", repositoryPath)
	log.Infof("cloning repository %s into %s\n", repoURL, repositoryPath)
	cloneNewRepository(repoURL, repositoryPath)
	return nil
}

func getRepositoryURLByLanguage(language string) (string, string, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		return "", "", err
	}
	repositoryPath := userHomeDir + "/.compage/templates/compage-template-" + language
	if language == "go" {
		return "https://github.com/intelops/compage-template-go.git", repositoryPath, nil
	} else if language == "python" {
		return "https://github.com/intelops/compage-template-python.git", repositoryPath, nil
	} else if language == "java" {
		return "https://github.com/intelops/compage-template-java.git", repositoryPath, nil
	} else if language == "javascript" {
		return "https://github.com/intelops/compage-template-javascript.git", repositoryPath, nil
	} else if language == "ruby" {
		return "https://github.com/intelops/compage-template-ruby.git", repositoryPath, nil
	} else if language == "rust" {
		return "https://github.com/intelops/compage-template-rust.git", repositoryPath, nil
	} else if language == "typescript" {
		return "https://github.com/intelops/compage-template-typescript.git", repositoryPath, nil
	} else if language == "common" {
		repositoryPath = userHomeDir + "/.compage/templates/common-templates"
		return "https://github.com/intelops/common-templates.git", repositoryPath, nil
	}
	return "", "", nil
}

func cloneNewRepository(repoURL string, cloneDir string) {
	_, err := git.PlainClone(cloneDir, false, &git.CloneOptions{
		URL:      repoURL,
		Progress: os.Stdout,
	})
	if err != nil {
		log.Errorf("error:%v", err)
		return
	}
	log.Infof("repository[%s] cloned successfully.", repoURL)
}

func pullExistingRepository(existingRepositoryPath string) {
	r, err := git.PlainOpen(existingRepositoryPath)
	if err != nil {
		log.Errorf("error:%v", err)
		return
	}
	// Get the working directory for the repository
	w, err := r.Worktree()
	if err != nil {
		log.Errorf("error:%v", err)
		return
	}
	// Pull the latest changes from the origin remote and merge into the current branch
	log.Info("git pull origin")
	err = w.Pull(&git.PullOptions{RemoteName: "origin"})
	if err != nil {
		if errors.Is(err, git.NoErrAlreadyUpToDate) {
			// This is a special error that means we don't have any new changes
			log.Info(err)
			return
		}
		log.Errorf("error:%v", err)
		return
	}
	// Print the latest commit that was just pulled
	ref, err := r.Head()
	if err != nil {
		log.Errorf("error:%v", err)
		return
	}
	commit, err := r.CommitObject(ref.Hash())
	if err != nil {
		log.Errorf("error:%v", err)
		return
	}
	log.Info(commit)
}
