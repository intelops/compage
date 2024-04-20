package license

import (
	corenode "github.com/intelops/compage/internal/core/node"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

// Copier integrations specific copier
type Copier struct {
	NodeName          string
	NodeDirectoryName string
	TemplatesRootPath string
	License           *corenode.License
	Data              map[string]interface{}
}

func NewCopier(gitRepositoryName, gitPlatformUserName, nodeName, nodeDirectoryName, templatesRootPath string, license *corenode.License) *Copier {
	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"GitPlatformUserName": gitPlatformUserName,
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		NodeName:          nodeName,
		Data:              data,
		License:           license,
	}
}

// CreateLicenseFiles creates the required directory and copies files from language template.
func (c Copier) CreateLicenseFiles() error {
	destDirectory := c.NodeDirectoryName
	if err := utils.CreateDirectories(destDirectory); err != nil {
		log.Errorf("error while creating directories [" + err.Error() + "]")
		return err
	}
	// copy license file if it's been supplied
	if c.License != nil && len(c.License.URL) > 0 {
		// read file from url in c.License.URL. This is applicable for both config.yaml file and ui flow.
		return utils.DownloadFile(c.NodeDirectoryName+"/LICENCE", c.License.URL)
	} else if c.License != nil && len(c.License.Path) > 0 {
		// local license file sent via config.yaml file.
		// get the absolute path of the license file
		_, err := utils.CopyFile(c.NodeDirectoryName+"/LICENCE", c.License.Path)
		if err != nil {
			log.Errorf("error while copying file [" + err.Error() + "]")
			return err
		}
	}
	// return from here as the license file has been copied
	return nil
}
