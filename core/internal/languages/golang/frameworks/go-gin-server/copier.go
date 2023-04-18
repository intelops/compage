package goginserver

import (
	"github.com/gertd/go-pluralize"
	"github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"strings"
)

const RestServerPath = "/pkg/rest/server"
const RestClientPath = "/pkg/rest/client"

const DaosPath = RestServerPath + "/daos"
const ServicesPath = RestServerPath + "/services"
const ControllersPath = RestServerPath + "/controllers"
const ModelsPath = RestServerPath + "/models"

const ControllerFile = "controller.go.tmpl"
const ServiceFile = "service.go.tmpl"
const DaoFile = "dao.go.tmpl"
const ModelFile = "model.go.tmpl"

const ClientFile = "client.go.tmpl"

// Copier Language specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	IsRestClient      bool
	RestServerPort    string
	Resources         []node.Resource
	RestClients       []languages.RestClient
	PluralizeClient   *pluralize.Client
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, resources []node.Resource, restClients []languages.RestClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	// set all resources for main.go.tmpl
	if isRestServer {
		type resourceData struct {
			ResourceNamePlural string
			ResourceName       string
		}

		var resourcesData []resourceData
		for _, r := range resources {
			resourcesData = append(resourcesData, resourceData{ResourceName: r.Name, ResourceNamePlural: pluralizeClient.Plural(strings.ToLower(r.Name))})
		}
		data["Resources"] = resourcesData
		data["RestServerPort"] = restServerPort
		data["IsRestServer"] = isRestServer
	}
	// if restClients slice has elements
	isRestClient := len(restClients) > 0
	data["IsRestClient"] = isRestClient

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsRestServer:      isRestServer,
		IsRestClient:      isRestClient,
		Resources:         resources,
		RestClients:       restClients,
		PluralizeClient:   pluralizeClient,
	}
}

// createRestClientDirectories creates rest client directories.
func (c Copier) createRestClientDirectories() error {
	clientDirectory := c.NodeDirectoryName + RestClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

// createRestServerDirectories creates rest server directories.
func (c Copier) createRestServerDirectories() error {
	controllersDirectory := c.NodeDirectoryName + ControllersPath
	modelsDirectory := c.NodeDirectoryName + ModelsPath
	servicesDirectory := c.NodeDirectoryName + ServicesPath
	daosDirectory := c.NodeDirectoryName + DaosPath

	if err := utils.CreateDirectories(controllersDirectory); err != nil {
		return err
	}
	if err := utils.CreateDirectories(modelsDirectory); err != nil {
		return err
	}
	if err := utils.CreateDirectories(servicesDirectory); err != nil {
		return err
	}
	if err := utils.CreateDirectories(daosDirectory); err != nil {
		return err
	}

	return nil
}

// copyRestServerResourceFiles copies rest server resource files from template and renames them as per resource config.
func (c Copier) copyRestServerResourceFiles(resource node.Resource) error {
	var filePaths []string
	resourceName := strings.ToLower(resource.Name)

	// copy controller files to generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + ControllerFile
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + ModelFile
	_, err0 := utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+ModelFile)
	if err0 != nil {
		return err0
	}
	filePaths = append(filePaths, targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + ServiceFile
	_, err1 := utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+ServiceFile)
	if err1 != nil {
		return err1
	}
	filePaths = append(filePaths, targetResourceServiceFileName)

	// copy dao files to generated project
	targetResourceDaoFileName := c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
	_, err2 := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+DaoFile)
	if err2 != nil {
		return err2
	}
	filePaths = append(filePaths, targetResourceDaoFileName)

	// add resource specific data to map in c needed for templates.
	c.addResourceSpecificTemplateData(resource)

	// apply template
	return executor.Execute(filePaths, c.Data)
}

// copyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (c Copier) copyRestClientResourceFiles(restClient languages.RestClient) error {
	/// add resource specific data to map in c needed for templates.
	c.Data["RestClientPort"] = restClient.Port
	c.Data["RestClientServiceName"] = restClient.ExternalNode

	// copy restClient files to generated project.
	targetResourceClientFileName := c.NodeDirectoryName + RestClientPath + "/" + restClient.ExternalNode + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+RestClientPath+"/"+ClientFile)
	if err != nil {
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}

func (c Copier) addResourceSpecificTemplateData(resource node.Resource) {
	// set resource specific key/value for data.
	c.Data["ResourceName"] = resource.Name
	// make every field public by making its first character capital.
	fields := map[string]string{}
	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		fields[key] = value
	}
	c.Data["Fields"] = fields
	c.Data["ResourceNameSingular"] = strings.ToLower(resource.Name)
	c.Data["ResourceNamePlural"] = c.PluralizeClient.Plural(strings.ToLower(resource.Name))
}

// CreateRestConfigs creates/copies relevant files to generated project
func (c Copier) CreateRestConfigs() error {
	if err := c.CreateRestServer(); err != nil {
		return err
	}
	if err := c.CreateRestClients(); err != nil {
		return err
	}
	return nil
}

// CreateRestServer creates/copies relevant files to generated project
func (c Copier) CreateRestServer() error {
	// if the node is server, add server code
	if c.IsRestServer {
		// create directories for controller, service, dao, models
		if err := c.createRestServerDirectories(); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range c.Resources {
			if err := c.copyRestServerResourceFiles(resource); err != nil {
				return err
			}
		}
	}
	return nil
}

// CreateRestClients creates/copies relevant files to generated project
func (c Copier) CreateRestClients() error {
	// if the node is client, add client code
	if c.IsRestClient {
		// create directories for client
		if err := c.createRestClientDirectories(); err != nil {
			return err
		}

		// copy files with respect to the names of resources
		for _, client := range c.RestClients {
			if err := c.copyRestClientResourceFiles(client); err != nil {
				return err
			}
		}
	}
	return nil
}

// CreateRootLevelFiles copies all root level files at language template.
func (c Copier) CreateRootLevelFiles() error {
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
