package ociregistry

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	spec "github.com/opencontainers/image-spec/specs-go/v1"
	log "github.com/sirupsen/logrus"
	"oras.land/oras-go/v2"
	"oras.land/oras-go/v2/content"
	"oras.land/oras-go/v2/content/file"
	"oras.land/oras-go/v2/registry"
	"oras.land/oras-go/v2/registry/remote"
	"os"
	"path/filepath"
)

func GetOCIArtifactURLAndPathByLanguage(language, version string) (string, string, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		return "", "", err
	}
	artifactPath := userHomeDir + "/.compage/templates/compage-template-" + language + "/" + version
	artifactURL := "ghcr.io/intelops/compage-template-" + language + ":" + version
	if language == "common" {
		artifactPath = userHomeDir + "/.compage/templates/common-templates/" + version
		return "ghcr.io/intelops/common-templates:" + version, artifactPath, nil
	}
	return artifactURL, artifactPath, nil
}

// Pull pulls an OCI image from a registry.
func Pull(requestCtx context.Context, disableTLS bool) (template *string, err error) {
	ociName := requestCtx.Value("artifactURL").(string)
	ref, err := registry.ParseReference(ociName)
	if err != nil {
		log.Errorf("parse reference: %v", err)
		return nil, fmt.Errorf("parse reference: %w", err)
	}

	if ref.Reference == ociLatestTag || ref.Reference == "" {
		return nil, fmt.Errorf("please don't use latest tag but specific version")
	}

	// Connect to a remote repository
	ctx := context.Background()

	repository, err := remote.NewRepository(ociName)
	if err != nil {
		log.Errorf("new repository: %v", err)
		return nil, fmt.Errorf("new repository: %w", err)
	}

	if disableTLS {
		log.Debugln("TLS connection is disabled")
		repository.PlainHTTP = true
	}

	// Get credentials from the docker credential store
	if err = getCredentialsFromDockerStore(repository); err != nil {
		log.Errorf("credstore from docker: %v", err)
		return nil, fmt.Errorf("credstore from docker: %w", err)
	}

	// Get remote manifest digest
	remoteManifestSpec, remoteManifestReader, err := oras.Fetch(ctx, repository, ref.String(), oras.DefaultFetchOptions)
	if err != nil {
		log.Errorf("fetch: %v", err)
		return nil, fmt.Errorf("fetch: %w", err)
	}

	remoteManifestData, err := content.ReadAll(remoteManifestReader, remoteManifestSpec)
	if err != nil {
		log.Errorf("fetch remote content: %v", err)
		return nil, fmt.Errorf("fetch remote content: %w", err)
	}

	// Create the template root directory
	templateRootDir := requestCtx.Value("artifactPath").(string)

	fs, err := file.New(templateRootDir)
	if err != nil {
		log.Errorf("create file store: %v", err)
		return nil, fmt.Errorf("create file store: %w", err)
	}
	defer func(fs *file.Store) {
		_ = fs.Close()
	}(fs)

	// Copy from the remote repository to the file store
	// Fetch the remote manifest
	remoteTemplate, err := getCompageTemplateFromManifestLayers(remoteManifestData, templateRootDir)

	template = remoteTemplate

	manifestDescriptor, err := oras.Copy(ctx, repository, ref.Reference, fs, ref.Reference, oras.DefaultCopyOptions)
	if err != nil {
		log.Errorf("copy: %v", err)
		return nil, fmt.Errorf("copy: %w", err)
	}

	manifestData, err := content.FetchAll(ctx, fs, manifestDescriptor)
	if err != nil {
		log.Errorf("fetch manifest: %v", err)
		return nil, fmt.Errorf("fetch manifest: %w", err)
	}

	if doTemplateFilesExistLocally(templateRootDir, remoteTemplate) {
		log.Debugf("Template %q already available in: %s\n", ociName, templateRootDir)
	} else {
		log.Infof("Pulling compage template %q\n", ociName)
		template, err = getCompageTemplateFromManifestLayers(manifestData, templateRootDir)
		if err != nil {
			return nil, fmt.Errorf("get media types from layers: %w", err)
		}
	}
	log.Debugf("template successfully pulled in %s", templateRootDir)

	return template, nil
}

// getCompageTemplateFromManifestLayers returns the list of templates from an OCI manifest
func getCompageTemplateFromManifestLayers(manifestData []byte, templateRootDir string) (
	*string, error) {
	specification := spec.Manifest{}
	err := json.Unmarshal(manifestData, &specification)
	if err != nil {
		log.Errorf("unmarshal manifest: %v", err)
		return nil, fmt.Errorf("unmarshal manifest: %w", err)
	}

	for _, layer := range specification.Layers {
		switch layer.MediaType {
		case commonTemplatesMediaType:
			fallthrough
		case compageTemplateGoMediaType:
			if title, ok := layer.Annotations["org.opencontainers.image.title"]; ok && title != "" {
				template := filepath.Join(templateRootDir, title)
				return &template, nil
			}
		default:
			log.Warningf("unknown media type: %q\n", layer.MediaType)
		}
	}

	return nil, nil
}

/*
doTemplateFilesExistLocally returns true if the template folder/directory is already available locally.
One more check is to see if the template has been tampered locally.
*/
func doTemplateFilesExistLocally(templateRootDir string, template *string) bool {
	var errs []error
	templateRootDirFileInfo, err := os.Stat(templateRootDir)
	// If store path exist and is a directory then we do nothing
	if err == nil {
		if !templateRootDirFileInfo.IsDir() {
			errs = append(errs, fmt.Errorf("template root dir %s already exist and is not a directory", templateRootDir))
		}
	} else {
		if !errors.Is(err, os.ErrNotExist) {
			errs = append(errs, fmt.Errorf("getting information about %s: %w", templateRootDir, err))
		}
	}

	isFileExist := func(file *string) {
		_, err = os.Stat(*file)
		if err == nil {
			return
		}
		if errors.Is(err, os.ErrNotExist) {
			errs = append(errs, fmt.Errorf("%s does not exist locally", *file))
		} else {
			errs = append(errs, fmt.Errorf("something went wrong while checking if %s exist: %w", *file, err))
		}
	}

	isFileExist(template)

	if len(errs) > 0 {
		for i := range errs {
			log.Debugln(errs[i])
		}
		return false
	}

	// check if the template has been tampered locally
	//todo: implement this
	return true
}
