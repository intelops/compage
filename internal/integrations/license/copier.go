package license

import (
	"encoding/json"
	"github.com/intelops/compage/cmd/models"
	"github.com/intelops/compage/internal/core"
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
)

const File = "LICENSE.tmpl"

// Copier integrations specific copier
type Copier struct {
	ProjectDirectoryName string
	GitRepositoryName    string
	TemplatesRootPath    string
	License              *models.License
	Data                 map[string]interface{}
}

func NewCopier(project *core.Project) (*Copier, error) {
	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   project.GitRepositoryName,
		"GitPlatformUserName": project.GitPlatformUserName,
	}

	templatesRootPath, err := utils.GetTemplatesRootPath("common-templates/", project.CompageCoreVersion)
	if err != nil {
		log.Errorf("error while getting the project root path [" + err.Error() + "]")
		return nil, err
	}
	// extract license from metadata
	license := &models.License{}
	if project.Metadata != nil {
		l, ok := project.Metadata["license"]
		if ok {
			licenseData, err1 := json.Marshal(l)
			if err1 != nil {
				log.Errorf("error while marshalling license data [" + err1.Error() + "]")
				return nil, err1
			}
			// for license data
			err1 = json.Unmarshal(licenseData, license)
			if err1 != nil {
				log.Errorf("error while unmarshalling license data [" + err1.Error() + "]")
				return nil, err1
			}
			// this is not required to be set back as we are not modifying the license data
			//project.Metadata["license"] = license
		} else {
			log.Warn("license data not found in project metadata")
		}
	}

	return &Copier{
		// TODO change this path to constant. Add language specific analysers in a generic way later.
		TemplatesRootPath:    templatesRootPath,
		ProjectDirectoryName: utils.GetProjectDirectoryName(project.Name),
		GitRepositoryName:    project.GitRepositoryName,
		Data:                 data,
		License:              license,
	}, nil
}

// CreateLicenseFiles creates the required directory and copies files from language template.
func (c Copier) CreateLicenseFiles() error {
	destDirectory := c.ProjectDirectoryName
	if err := utils.CreateDirectories(destDirectory); err != nil {
		log.Errorf("error while creating directories [" + err.Error() + "]")
		return err
	}
	// copy license file if it's been supplied
	if c.License != nil && len(c.License.URL) > 0 {
		// read file from url in c.License.URL. This is applicable for both config.yaml file and ui flow.
		return utils.DownloadFile(c.ProjectDirectoryName+"/LICENCE", c.License.URL)
	} else if c.License != nil && len(c.License.Path) > 0 {
		// local license file sent via config.yaml file.
		// get the absolute path of the license file
		_, err := utils.CopyFile(c.ProjectDirectoryName+"/LICENCE", c.License.Path)
		if err != nil {
			log.Errorf("error while copying file [" + err.Error() + "]")
			return err
		}
		// return from here as the license file has been copied
		return nil
	}
	// copy license file from templates (the default one)
	var filePaths []*string
	// copy deployment files to generated license config files
	targetLicenseFileName := c.ProjectDirectoryName + "/" + File
	_, err := utils.CopyFile(targetLicenseFileName, c.TemplatesRootPath+"/"+File)
	if err != nil {
		log.Errorf("error while copying file [" + err.Error() + "]")
		return err
	}
	filePaths = append(filePaths, &targetLicenseFileName)
	return executor.Execute(filePaths, c.Data)
}
