package golang

import (
	"errors"
	"github.com/kube-tarian/compage-core/internal/languages"
	"github.com/kube-tarian/compage-core/internal/utils"
)

// Generator generates golang specific code according to config passed
func Generator(projectName string, goNode *GoNode) error {
	// Copy required files from templates, a few of them may need renaming.
	// Iterate over all the files in template folder
	if goNode.Template == Compage {
		// retrieve project named directory
		projectDirectory := utils.GetProjectDirectoryName(projectName)

		// create node directory in projectDirectory depicting a subproject
		nodeDirectoryName := projectDirectory + "/" + goNode.Name
		if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
			return err
		}

		// copy all files at root level
		err := CopyRootLevelFiles(utils.GolangTemplatesPath, nodeDirectoryName)
		if err != nil {
			return err
		}

		// copy kubernetes yamls
		err = CreateKubernetesDirectory(nodeDirectoryName)
		if err != nil {
			return err
		}

		// copy relevant files from templates based on config received, if the node is server
		if err = CreateRestConfigs(goNode, err, nodeDirectoryName); err != nil {
			return err
		}

	} else {
		// frameworks cli tools
		return errors.New("unsupported template for language : " + languages.Go)
	}
	return nil
}

// CreateRestConfigs creates/copies relevant files to generated project
func CreateRestConfigs(goNode *GoNode, err error, nodeDirectoryName string) error {
	if goNode.RestConfig != nil {
		if goNode.RestConfig.Server != nil {
			//create directories for controller, service, dao, models
			if err = CreateRestServerDirectories(nodeDirectoryName); err != nil {
				return err
			}
			// copy files with respect to the names of resources
			for _, resource := range goNode.RestConfig.Server.Resources {
				if err = CopyRestServerResourceFiles(resource, nodeDirectoryName); err != nil {
					return err
				}
			}
		}
		// The below can't be committed as it will break the flow. Once the integration is done, we can uncomment it.
		//if goNode.GrpcConfig != nil {
		//	return errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", goNode.GrpcConfig.Framework, languages.Go))
		//}
		//if goNode.WsConfig != nil {
		//	return errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", goNode.GrpcConfig.Framework, languages.Go))
		//}
		//if goNode.DBConfig != nil {
		//	return errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", goNode.GrpcConfig.Framework, languages.Go))
		//}
	}

	//if the node is client, add client code
	if goNode.RestConfig.Clients != nil {
		// extract server ports and source - needed this for url
		//fmt.Println(otherServersInfo)

		//create directories for /pkg/rest/controller, service, dao, models
		if err = CreateRestClientDirectories(nodeDirectoryName); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		//for _, resource := range goNode.RestConfig.Resources {
		//	if err = CopyRestClientResourceFiles(resource, nodeDirectoryName); err != nil {
		//		return err
		//	}
		//}
	}
	return nil
}
