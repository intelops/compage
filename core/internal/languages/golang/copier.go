package golang

import (
	"context"
	"github.com/kube-tarian/compage/core/internal/core/node"
	"github.com/kube-tarian/compage/core/internal/languages"
	"github.com/kube-tarian/compage/core/internal/utils"
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
	Ctx               context.Context
	NodeDirectoryName string
	GoNode            *GoNode
	ProjectName       string
	Data              map[string]interface{}
}

func NewCopier(ctx context.Context) *Copier {
	values := ctx.Value(ContextVars).(Values)
	repositoryName := values.Get(RepositoryName)
	nodeName := values.Get(NodeName)
	userName := values.Get(UserName)

	//populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}

	//set all resources for main.go.tmpl
	if values.GoNode.RestConfig.Server != nil {
		type resourceData struct {
			ResourceNamePlural string
			ResourceName       string
		}

		var resourcesData []resourceData
		resources := values.GoNode.RestConfig.Server.Resources
		for _, r := range resources {
			resourcesData = append(resourcesData, resourceData{ResourceName: r.Name, ResourceNamePlural: strings.ToLower(r.Name) + "s"})
		}
		data["Resources"] = resourcesData
		data["ServerPort"] = values.GoNode.LanguageNode.RestConfig.Server.Port
		data["IsServer"] = true
	}

	return &Copier{
		Ctx:               ctx,
		NodeDirectoryName: values.NodeDirectoryName,
		GoNode:            values.GoNode,
		Data:              data,
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
	_, err := utils.CopyFile(targetResourceControllerFileName, utils.GolangTemplatesPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceControllerFileName)
	// copy model files to generated project
	targetResourceModelFileName := copier.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + ModelFile
	_, err = utils.CopyFile(targetResourceModelFileName, utils.GolangTemplatesPath+ModelsPath+"/"+ModelFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceModelFileName)
	// copy service files to generated project
	targetResourceServiceFileName := copier.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + ServiceFile
	_, err = utils.CopyFile(targetResourceServiceFileName, utils.GolangTemplatesPath+ServicesPath+"/"+ServiceFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceServiceFileName)
	// copy dao files to generated project
	targetResourceDaoFileName := copier.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
	_, err = utils.CopyFile(targetResourceDaoFileName, utils.GolangTemplatesPath+DaosPath+"/"+DaoFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceDaoFileName)

	/// add resource specific data to map in copier needed for templates.
	copier.addResourceSpecificTemplateData(resource)

	// apply template
	if err2 := copier.applyTemplate(filePaths); err2 != nil {
		return err2
	}

	return nil
}

// CopyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (copier Copier) CopyRestClientResourceFiles(client languages.RestClient) error {
	/// add resource specific data to map in copier needed for templates.
	copier.Data["ClientPort"] = client.Port
	copier.Data["ClientServiceName"] = client.ExternalNode

	// copy client files to generated project.
	targetResourceClientFileName := copier.NodeDirectoryName + ClientPath + "/" + client.ExternalNode + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, utils.GolangTemplatesPath+ClientPath+"/"+ClientFile)
	if err != nil {
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)
	// apply template
	if err2 := copier.applyTemplate(filePaths); err2 != nil {
		return err2
	}

	return nil
}

// CreateRestConfigs creates/copies relevant files to generated project
func (copier Copier) CreateRestConfigs() error {
	// if the node is server, add server code
	if copier.GoNode.RestConfig.Server != nil {
		// create directories for controller, service, dao, models
		if err := copier.CreateRestServerDirectories(); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range copier.GoNode.RestConfig.Server.Resources {
			if err := copier.CopyRestServerResourceFiles(resource); err != nil {
				return err
			}
		}
	}
	// if the node is client, add client code
	if copier.GoNode.RestConfig.Clients != nil {
		// create directories for client
		if err := copier.CreateRestClientDirectories(); err != nil {
			return err
		}

		// copy files with respect to the names of resources
		for _, client := range copier.GoNode.RestConfig.Clients {
			if err := copier.CopyRestClientResourceFiles(client); err != nil {
				return err
			}
		}
	}
	return nil
}

// CreateKubernetesFiles creates required directory and copies files from language template.
func (copier Copier) CreateKubernetesFiles(templatePath string) error {
	destKubernetesDirectory := copier.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}

	var filePaths []string
	if copier.GoNode.RestConfig.Server != nil {
		// copy service files to generated kubernetes manifests
		targetKubernetesServiceFileName := copier.NodeDirectoryName + KubernetesPath + "/" + KubernetesServiceFile
		_, err := utils.CopyFile(targetKubernetesServiceFileName, utils.GolangTemplatesPath+KubernetesPath+"/"+KubernetesServiceFile)
		if err != nil {
			return err
		}
		filePaths = append(filePaths, targetKubernetesServiceFileName)
	}
	// copy deployment files to generated kubernetes manifests
	targetKubernetesDeploymentFileName := copier.NodeDirectoryName + KubernetesPath + "/" + KubernetesDeploymentFile
	_, err := utils.CopyFile(targetKubernetesDeploymentFileName, utils.GolangTemplatesPath+KubernetesPath+"/"+KubernetesDeploymentFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetKubernetesDeploymentFileName)
	if err = copier.applyTemplate(filePaths); err != nil {
		return err
	}

	return nil
}

// CreateRootLevelFiles copies all root level files at language template.
func (copier Copier) CreateRootLevelFiles(templatePath string) error {
	err := utils.CopyFiles(copier.NodeDirectoryName, templatePath)
	if err != nil {
		return err
	}

	return copier.apply()
}

func (copier Copier) apply() error {
	_, files, err := utils.GetDirectoriesAndFilePaths(copier.NodeDirectoryName)
	if err != nil {
		return err
	}

	return copier.applyTemplate(files)
}

func (copier Copier) addResourceSpecificTemplateData(resource node.Resource) {
	// set resource specific key/value for data.
	copier.Data["ResourceName"] = resource.Name
	//make every field public by making its first character capital.
	fields := map[string]string{}
	for key, value := range resource.Fields {
		// TODO change this approach
		key = strings.Title(key)
		fields[key] = value
	}
	copier.Data["Fields"] = fields
	copier.Data["ResourceNameSingular"] = strings.ToLower(resource.Name)
	copier.Data["ResourceNamePlural"] = strings.ToLower(resource.Name) + "s"
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
