package dotnet_mvc_framework

import (
	"github.com/gertd/go-pluralize"
	"github.com/intelops/compage/core/internal/languages/executor"
	log "github.com/sirupsen/logrus"

	"strings"

	"github.com/intelops/compage/core/internal/utils"
)

const RestServerPath = "/pkg/rest/server"

// Copier Language specific *Copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	RestServerPort    string
	PluralizeClient   *pluralize.Client
}

func NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"GitPlatformUserName": gitPlatformUserName,
		"GitPlatformURL":      strings.Replace(gitPlatformURL, "https://", "", -1),
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		PluralizeClient:   pluralizeClient,
	}
}

// createRestServerDirectories creates rest server directories.
func (c *Copier) createRestServerDirectories() error {
	rootDirectory := c.NodeDirectoryName
	if err := utils.CreateDirectories(rootDirectory); err != nil {
		log.Debugf("error creating root directory: %v", err)
		return err
	}
	return nil
}

// CreateRestConfigs creates/copies relevant files to generated project
func (c *Copier) CreateRestConfigs() error {
	if err := c.CreateRestServer(); err != nil {
		log.Debugf("error creating rest server: %v", err)
		return err
	}
	return nil
}

// CreateRestServer creates/copies relevant files to generated project
func (c *Copier) CreateRestServer() error {
	// if the node is server, add server code
	if c.IsRestServer {
		// create directories for controller, service, dao, models
		if err := c.createRestServerDirectories(); err != nil {
			log.Debugf("error creating rest server directories: %v", err)
			return err
		}
	}
	return nil
}

// CreateRootLevelFiles copies all root level files at language template.
func (c *Copier) CreateRootLevelFiles() error {
	err := utils.CopyFiles(c.NodeDirectoryName, c.TemplatesRootPath)
	if err != nil {
		return err
	}
	_, files, err0 := utils.GetDirectoriesAndFilePaths(c.NodeDirectoryName)
	if err0 != nil {
		return err0
	}
	return executor.Execute(files, c.Data)
}
