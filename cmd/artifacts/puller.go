package artifacts

import (
	"context"
	"errors"
	"github.com/intelops/compage/cmd/artifacts/cosign"
	"github.com/intelops/compage/cmd/artifacts/git"
	"github.com/intelops/compage/cmd/artifacts/oci-registry"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

func PullOCIArtifact(language, version string) error {
	artifactURL, artifactPath, err := ociregistry.GetOCIArtifactURLAndPathByLanguage(language, version)
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}
	if artifactURL == "" || artifactPath == "" {
		log.Errorf("language %s not supported", language)
		return errors.New("language not supported")
	}

	repositoryURL, repositoryPath, err := git.GetRepositoryURLByLanguage(language, version)
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}

	ctx := context.Background()
	ctx = context.WithValue(ctx, "artifactURL", artifactURL)
	ctx = context.WithValue(ctx, "artifactPath", artifactPath)
	ctx = context.WithValue(ctx, "repositoryURL", repositoryURL)
	ctx = context.WithValue(ctx, "repositoryPath", repositoryPath)

	exists, err := utils.DirectoryExists(artifactPath)
	if err != nil {
		log.Errorf("error checking directory existence: %v", err)
		return err
	}
	if exists {
		log.Debugf("directory %s exists.\n", artifactPath)
		if git.IsCommitSimilar(repositoryURL, repositoryPath, version) {
			log.Debugf("commit is similar, no need to pull the artifact")
			return nil
		} else {
			log.Debugf("commit is not similar, need to pull the artifact")
		}
	} else {
		log.Debugf("directory %s does not exist.\n", artifactPath)
	}

	log.Infof("verifying artifact %s \n", artifactURL)
	err = cosign.VerifyArtifact(ctx, "")
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}

	log.Infof("pulling artifact %s into %s\n", artifactURL, artifactPath)
	_, err = ociregistry.Pull(ctx, false)
	if err != nil {
		log.Errorf("error:%v", err)
		return err
	}

	return nil
}
