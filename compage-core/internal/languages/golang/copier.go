package golang

import (
	"context"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
	"github.com/kube-tarian/compage-core/internal/utils"
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
}

func NewCopier(ctx context.Context) *Copier {
	values := ctx.Value(ContextVars).(Values)

	return &Copier{
		Ctx:               ctx,
		NodeDirectoryName: values.NodeDirectoryName,
		GoNode:            values.GoNode,
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
	filePaths = append(filePaths, targetResourceControllerFileName)
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

	values := copier.Ctx.Value(ContextVars).(Values)

	repositoryName := values.Get(RepositoryName)
	nodeName := values.Get(NodeName)

	data := map[string]interface{}{
		"ResourceName":         resource.Name,
		"Fields":               resource.Fields,
		"ResourceNameSingular": strings.ToLower(resource.Name),
		"ResourceNamePlural":   strings.ToLower(resource.Name) + "s",
		"RepositoryName":       repositoryName,
		"NodeName":             nodeName,
	}

	for _, filePathName := range filePaths {
		// template code
		parsedTemplates := template.Must(template.New("").Option("missingkey=zero").ParseFiles(filePathName))
		// generate go code now
		fileName := filePathName[strings.LastIndex(filePathName, utils.SubstrString)+1:]
		createdFile, err2 := os.Create(strings.TrimSuffix(filePathName, utils.TemplateExtension))
		if err2 != nil {
			return err2
		}
		if err2 = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err2 != nil {
			return err2
		}

		//If file is deleted, it fails in next iteration. I think the template parsing
		// should happen on current file.
		//TODO
		//if err2 = os.Remove(filePathName); err2 != nil {
		//	return err2
		//}
	}

	return nil
}

// CopyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (copier Copier) CopyRestClientResourceFiles(client languages.RestClient) error {
	// copy client files to generated project.
	targetResourceClientFileName := copier.NodeDirectoryName + ClientPath + "/" + client.ExternalNode + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, utils.GolangTemplatesPath+ClientPath+"/"+ClientFile)
	if err != nil {
		return err
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
	srcKubernetesDirectory := templatePath + KubernetesPath
	destKubernetesDirectory := copier.NodeDirectoryName + KubernetesPath
	if err := utils.CreateDirectories(destKubernetesDirectory); err != nil {
		return err
	}
	return utils.CopyFilesAndDirs(destKubernetesDirectory, srcKubernetesDirectory)
}

// CreateRootLevelFiles copies all root level files at language template.
func (copier Copier) CreateRootLevelFiles(templatePath string) error {
	return utils.CopyFiles(copier.NodeDirectoryName, templatePath)
}
