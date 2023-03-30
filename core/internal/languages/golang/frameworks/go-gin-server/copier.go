package go_gin_server

import (
	"github.com/gertd/go-pluralize"
	"github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/utils"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"os"
	"strings"
	"text/template"
)

const RestServerPath = "/pkg/rest/server"
const RestClientPath = "/pkg/rest/client"

const DaosPath = RestServerPath + "/daos"
const ServicesPath = RestServerPath + "/services"
const ControllersPath = RestServerPath + "/controllers"
const ModelsPath = RestServerPath + "/models"

const KubernetesPath = "/kubernetes"
const KubernetesDeploymentFile = "deployment.yaml.tmpl"
const KubernetesServiceFile = "service.yaml.tmpl"

const ClientPath = "/pkg/rest/client"

const ControllerFile = "controller.go.tmpl"
const ServiceFile = "service.go.tmpl"
const DaoFile = "dao.go.tmpl"
const ModelFile = "model.go.tmpl"

const ClientFile = "client.go.tmpl"

// Copier Language specific copier
type Copier struct {
	NodeDirectoryName   string
	GoTemplatesRootPath string
	ProjectName         string
	Data                map[string]interface{}
	IsServer            bool
	Port                string
	Resources           []node.Resource
	Clients             []languages.RestClient
	PluralizeClient     *pluralize.Client
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, goTemplatesRootPath string, isServer bool, serverPort string, resources []node.Resource, clients []languages.RestClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	// set all resources for main.go.tmpl
	if isServer {
		type resourceData struct {
			ResourceNamePlural string
			ResourceName       string
		}

		var resourcesData []resourceData
		resources := resources
		for _, r := range resources {
			resourcesData = append(resourcesData, resourceData{ResourceName: r.Name, ResourceNamePlural: pluralizeClient.Plural(strings.ToLower(r.Name))})
		}
		data["Resources"] = resourcesData
		data["Port"] = serverPort
		data["IsServer"] = isServer
	}

	return &Copier{
		GoTemplatesRootPath: goTemplatesRootPath,
		NodeDirectoryName:   nodeDirectoryName,
		Data:                data,
		Clients:             clients,
		PluralizeClient:     pluralizeClient,
	}
}

// CreateRestClientDirectories creates rest client directories.
func (copier Copier) CreateRestClientDirectories() error {
	clientDirectory := copier.NodeDirectoryName + RestClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

// CreateRestServerDirectories creates rest server directories.
func (copier Copier) CreateRestServerDirectories() error {
	controllersDirectory := copier.NodeDirectoryName + ControllersPath
	modelsDirectory := copier.NodeDirectoryName + ModelsPath
	servicesDirectory := copier.NodeDirectoryName + ServicesPath
	daosDirectory := copier.NodeDirectoryName + DaosPath

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

// CopyRestServerResourceFiles copies rest server resource files from template and renames them as per resource config.
func (copier Copier) CopyRestServerResourceFiles(resource node.Resource) error {
	var filePaths []string
	resourceName := strings.ToLower(resource.Name)

	// copy controller files to generated project
	targetResourceControllerFileName := copier.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + ControllerFile
	_, err := utils.CopyFile(targetResourceControllerFileName, copier.GoTemplatesRootPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := copier.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + ModelFile
	_, err1 := utils.CopyFile(targetResourceModelFileName, copier.GoTemplatesRootPath+ModelsPath+"/"+ModelFile)
	if err1 != nil {
		return err1
	}
	filePaths = append(filePaths, targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := copier.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + ServiceFile
	_, err2 := utils.CopyFile(targetResourceServiceFileName, copier.GoTemplatesRootPath+ServicesPath+"/"+ServiceFile)
	if err2 != nil {
		return err2
	}
	filePaths = append(filePaths, targetResourceServiceFileName)

	// copy dao files to generated project
	targetResourceDaoFileName := copier.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
	_, err3 := utils.CopyFile(targetResourceDaoFileName, copier.GoTemplatesRootPath+DaosPath+"/"+DaoFile)
	if err3 != nil {
		return err3
	}
	filePaths = append(filePaths, targetResourceDaoFileName)

	/// add resource specific data to map in copier needed for templates.
	copier.addResourceSpecificTemplateData(resource)

	// apply template
	return copier.applyTemplate(filePaths)
}

// CopyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (copier Copier) CopyRestClientResourceFiles(client languages.RestClient) error {
	/// add resource specific data to map in copier needed for templates.
	copier.Data["ClientPort"] = client.Port
	copier.Data["ClientServiceName"] = client.ExternalNode

	// copy client files to generated project.
	targetResourceClientFileName := copier.NodeDirectoryName + ClientPath + "/" + client.ExternalNode + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, copier.GoTemplatesRootPath+ClientPath+"/"+ClientFile)
	if err != nil {
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return copier.applyTemplate(filePaths)
}

// CreateRestConfigs creates/copies relevant files to generated project
func (copier Copier) CreateRestConfigs() error {
	// if the node is server, add server code
	if copier.IsServer {
		// create directories for controller, service, dao, models
		if err := copier.CreateRestServerDirectories(); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range copier.Resources {
			if err := copier.CopyRestServerResourceFiles(resource); err != nil {
				return err
			}
		}
	}
	// if the node is client, add client code
	if copier.Clients != nil {
		// create directories for client
		if err := copier.CreateRestClientDirectories(); err != nil {
			return err
		}

		// copy files with respect to the names of resources
		for _, client := range copier.Clients {
			if err := copier.CopyRestClientResourceFiles(client); err != nil {
				return err
			}
		}
	}
	return nil
}

// CreateKubernetesFiles creates required directory and copies files from language template.
func (copier Copier) CreateKubernetesFiles() error {
	destKubernetesDirectory := copier.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}

	var filePaths []string
	if copier.IsServer {
		// copy service files to generated kubernetes manifests
		targetKubernetesServiceFileName := copier.NodeDirectoryName + KubernetesPath + "/" + KubernetesServiceFile
		_, err := utils.CopyFile(targetKubernetesServiceFileName, copier.GoTemplatesRootPath+KubernetesPath+"/"+KubernetesServiceFile)
		if err != nil {
			return err
		}
		filePaths = append(filePaths, targetKubernetesServiceFileName)
	}
	// copy deployment files to generated kubernetes manifests
	targetKubernetesDeploymentFileName := copier.NodeDirectoryName + KubernetesPath + "/" + KubernetesDeploymentFile
	_, err := utils.CopyFile(targetKubernetesDeploymentFileName, copier.GoTemplatesRootPath+KubernetesPath+"/"+KubernetesDeploymentFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetKubernetesDeploymentFileName)
	return copier.applyTemplate(filePaths)
}

// CreateRootLevelFiles copies all root level files at language template.
func (copier Copier) CreateRootLevelFiles() error {
	err := utils.CopyFiles(copier.NodeDirectoryName, copier.GoTemplatesRootPath)
	if err != nil {
		return err
	}
	_, files, err0 := utils.GetDirectoriesAndFilePaths(copier.NodeDirectoryName)
	if err0 != nil {
		return err0
	}
	return copier.applyTemplate(files)
}

func (copier Copier) addResourceSpecificTemplateData(resource node.Resource) {
	// set resource specific key/value for data.
	copier.Data["ResourceName"] = resource.Name
	// make every field public by making its first character capital.
	fields := map[string]string{}
	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		fields[key] = value
	}
	copier.Data["Fields"] = fields
	copier.Data["ResourceNameSingular"] = strings.ToLower(resource.Name)
	copier.Data["ResourceNamePlural"] = copier.PluralizeClient.Plural(strings.ToLower(resource.Name))
}

func (copier Copier) applyTemplate(filePaths []string) error {
	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(template.New("").Option("missingkey=zero").ParseFiles(filePathName))
		// generate go code now
		fileName := filePathName[strings.LastIndex(filePathName, utils.SubstrString)+1:]
		createdFile, err2 := os.Create(strings.TrimSuffix(filePathName, utils.TemplateExtension))
		if err2 != nil {
			return err2
		}
		if err2 = parsedTemplates.ExecuteTemplate(createdFile, fileName, copier.Data); err2 != nil {
			return err2
		}
	}

	// delete the template files
	for _, filePathName := range filePaths {
		if strings.HasSuffix(filePathName, ".tmpl") {
			if err2 := os.Remove(filePathName); err2 != nil {
				return err2
			}
		}
	}
	return nil
}
