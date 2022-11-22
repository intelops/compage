package golang

import (
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
	"github.com/kube-tarian/compage-core/internal/utils"
)

const RestServerPath = "/pkg/rest/server"
const RestClientPath = "/pkg/rest/client"

const DaosPath = RestServerPath + "/daos"
const ServicesPath = RestServerPath + "services"
const ControllersPath = RestServerPath + "/controllers"
const ModelsPath = RestServerPath + "/models"

const ClientPath = "/pkg/rest/client"

const ControllerFile = "controller.go.tmpl"
const ServiceFile = "service.go.tmpl"
const DaoFile = "dao.go.tmpl"
const ModelFile = "model.go.tmpl"

const ClientFile = "client.go.tmpl"

// Copier Language specific copier
type Copier struct {
	NodeDirectoryName string `json:"nodeDirectoryName"`
	GoNode            GoNode `json:"goNode"`
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
	// copy controller files to generated project
	targetResourceControllerFileName := copier.NodeDirectoryName + ControllersPath + "/" + resource.Name + "-" + ControllerFile
	_, err := utils.CopyFile(targetResourceControllerFileName, utils.GolangTemplatesPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		return err
	}
	// copy model files to generated project
	targetResourceModelFileName := copier.NodeDirectoryName + ModelsPath + "/" + resource.Name + "-" + ModelFile
	_, err = utils.CopyFile(targetResourceModelFileName, utils.GolangTemplatesPath+ModelsPath+"/"+ModelFile)
	if err != nil {
		return err
	}
	// copy service files to generated project
	targetResourceServiceFileName := copier.NodeDirectoryName + ServicesPath + "/" + resource.Name + "-" + ServiceFile
	_, err = utils.CopyFile(targetResourceServiceFileName, utils.GolangTemplatesPath+ServicesPath+"/"+ServiceFile)
	if err != nil {
		return err
	}
	// copy dao files to generated project
	targetResourceDaoFileName := copier.NodeDirectoryName + DaosPath + "/" + resource.Name + "-" + DaoFile
	_, err = utils.CopyFile(targetResourceDaoFileName, utils.GolangTemplatesPath+DaosPath+"/"+DaoFile)
	if err != nil {
		return err
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
