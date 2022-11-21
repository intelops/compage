package golang

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/utils"
	"io"
	"os"
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

func CreateKubernetesDirectory(nodeDirectoryName string) error {
	kubernetesDirectory := nodeDirectoryName + "/kubernetes"

	if err := utils.CreateDirectories(kubernetesDirectory); err != nil {
		return err
	}

	//targetServerDeploymentYaml := ""
	//targetServerServiceYaml := ""
	//targetClientDeploymentYaml := ""
	//TODO create files with above names

	return nil
}

func CopyKubernetesFiles(nodeDirectoryName string) error {
	//kubernetesDirectory := nodeDirectoryName + "/kubernetes"
	//
	//targetServerDeploymentYaml := kubernetesDirectory + ""
	//targetServerServiceYaml := kubernetesDirectory + ""
	//targetClientDeploymentYaml := kubernetesDirectory + ""

	//TODO create files with above names

	return nil
}

func CopyRootLevelFiles(src, dest string) error {
	openedFile, err := os.Open(src)
	if err != nil {
		return err
	}

	if fileInfo, err0 := openedFile.Stat(); err0 != nil {
		return err0
	} else if !fileInfo.IsDir() {
		return fmt.Errorf("Source " + fileInfo.Name() + " is not a directory!")
	}

	if err = os.Mkdir(dest, 0755); err != nil && err != os.ErrExist {
		return err
	}

	if files, err1 := os.ReadDir(src); err1 != nil {
		return err1
	} else {
		for _, file := range files {
			if !file.IsDir() {
				content, err2 := os.ReadFile(src + "/" + file.Name())
				if err2 != nil {
					return err2
				}
				err2 = os.WriteFile(dest+"/"+file.Name(), content, 0755)
				if err2 != nil {
					return err2
				}
			}
		}
	}
	return nil
}

func CreateRestClientDirectories(nodeDirectoryName string) error {
	clientDirectory := nodeDirectoryName + RestClientPath

	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

func CreateRestServerDirectories(nodeDirectoryName string) error {
	controllersDirectory := nodeDirectoryName + ControllersPath
	modelsDirectory := nodeDirectoryName + ModelsPath
	servicesDirectory := nodeDirectoryName + ServicesPath
	daosDirectory := nodeDirectoryName + DaosPath

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

func CopyRestServerResourceFiles(resource node.Resource, nodeDirectoryName string) error {
	targetResourceControllerFileName := nodeDirectoryName + ControllersPath + "/" + resource.Name + "-" + ControllerFile
	_, err := CopyFile(utils.GolangTemplatesPath+ControllersPath+"/"+ControllerFile, targetResourceControllerFileName)
	if err != nil {
		return err
	}

	targetResourceModelFileName := nodeDirectoryName + ModelsPath + "/" + resource.Name + "-" + ModelFile
	_, err = CopyFile(utils.GolangTemplatesPath+ModelsPath+"/"+ModelFile, targetResourceModelFileName)
	if err != nil {
		return err
	}

	targetResourceServiceFileName := nodeDirectoryName + ServicesPath + "/" + resource.Name + "-" + ServiceFile
	_, err = CopyFile(utils.GolangTemplatesPath+ServicesPath+"/"+ServiceFile, targetResourceServiceFileName)
	if err != nil {
		return err
	}

	targetResourceDaoFileName := nodeDirectoryName + DaosPath + "/" + resource.Name + "-" + DaoFile
	_, err = CopyFile(utils.GolangTemplatesPath+DaosPath+"/"+DaoFile, targetResourceDaoFileName)
	if err != nil {
		return err
	}

	return nil
}

func CopyRestClientResourceFiles(resource node.Resource, nodeDirectoryName string) error {
	targetResourceClientFileName := nodeDirectoryName + ClientPath + "/" + resource.Name + "-" + ClientFile
	_, err := CopyFile(utils.GolangTemplatesPath+ClientPath+"/"+ClientFile, targetResourceClientFileName)
	if err != nil {
		return err
	}

	return nil
}

func CopyFile(src, dst string) (int64, error) {
	sourceFileStat, err := os.Stat(src)
	if err != nil {
		return 0, err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return 0, fmt.Errorf("%s is not a regular file", src)
	}

	source, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer func(source *os.File) {
		_ = source.Close()
	}(source)

	destination, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer func(destination *os.File) {
		_ = destination.Close()
	}(destination)
	return io.Copy(destination, source)
}
