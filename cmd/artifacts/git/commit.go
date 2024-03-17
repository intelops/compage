package git

import (
	"errors"
	"fmt"
	"github.com/go-git/go-git/v5"
	"github.com/go-git/go-git/v5/config"
	"github.com/go-git/go-git/v5/storage/memory"
	log "github.com/sirupsen/logrus"
	"os"
)

func GetRepositoryURLByLanguage(language, version string) (string, string, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		return "", "", err
	}
	repositoryPath := userHomeDir + "/.compage/templates/compage-template-" + language + "/" + version
	repositoryURL := "https://github.com/intelops/compage-template-" + language + ".git"
	if language == "common" {
		repositoryPath = userHomeDir + "/.compage/templates/common-templates/" + version
		return "https://github.com/intelops/common-templates.git", repositoryPath, nil
	}
	return repositoryURL, repositoryPath, nil
}

func CheckIfSHACommitSimilar(repositoryURL, repositoryPath, version string) (bool, error) {
	// Get local commit SHA
	localSHA, err := GetLocalGitCommitSHA(repositoryPath)
	if err != nil {
		log.Error("Error fetching local Git commit SHA:", err)
		return false, err
	}

	// Get remote commit SHA
	remoteSHA, err := GetRemoteGitCommitSHA(repositoryURL, version)
	if err != nil {
		log.Errorf("Error fetching remote Git commit SHA: %s", err)
		return false, err
	}

	isDirty, err := IsRepositoryDirty(repositoryPath)
	if err != nil {
		log.Errorf("Error checking if repository is dirty: %s", err)
		return false, err
	}
	if isDirty {
		log.Errorf("Repository is dirty")
		return false, errors.New("repository is dirty")
	}

	return localSHA == remoteSHA, nil
}

func GetLocalGitCommitSHA(repositoryPath string) (string, error) {
	// Open the given repository
	r, err := git.PlainOpen(repositoryPath)
	if err != nil {
		log.Errorf("Error opening repository: %s", err)
		return "", err
	}

	// Get the HEAD reference
	ref, err := r.Head()
	if err != nil {
		log.Errorf("Error getting HEAD reference: %s", err)
		return "", err
	}

	// Get the commit SHA
	commitSHA := ref.Hash().String()

	return commitSHA, nil
}

func GetRemoteGitCommitSHA(repositoryURL, version string) (string, error) {
	// List remote references
	references, err := git.NewRemote(memory.NewStorage(), &config.RemoteConfig{
		Name: "origin",
		URLs: []string{repositoryURL},
	}).List(&git.ListOptions{})
	if err != nil {
		log.Errorf("Error listing remote references: %s", err)
		return "", err
	}

	// Look for the branch reference
	for _, ref := range references {
		if ref.Name().String() == "refs/tags/"+version {
			return ref.Hash().String(), nil
		}
	}

	return "", fmt.Errorf("branch %s not found", version)
}

func IsRepositoryDirty(repositoryPath string) (bool, error) {
	// Open the given repository
	repository, err := git.PlainOpen(repositoryPath)
	if err != nil {
		log.Errorf("Error opening repository: %s", err)
		return false, err
	}

	// Get the working directory for the repository
	worktree, err := repository.Worktree()
	if err != nil {
		log.Errorf("Error getting working directory: %s", err)
		return false, err
	}

	// Check the status of the working directory
	status, err := worktree.Status()
	if err != nil {
		log.Errorf("Error getting working directory status: %s", err)
		return false, err
	}

	// The repository is dirty if there are any changes in the status
	return !status.IsClean(), nil
}

func IsCommitSimilar(repositoryURL, repositoryPath, version string) bool {
	commitSimilar, err := CheckIfSHACommitSimilar(repositoryURL, repositoryPath, version)
	if err != nil {
		log.Errorf("error while checking the commit sha [" + err.Error() + "]")
		return false
	}
	if !commitSimilar {
		log.Errorf("the templates are not matching with the latest commit, please pull the latest templates")
		return false
	}
	return true
}
