package generator

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/utils"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// ParseTemplates parse.go
func ParseTemplates(templatesPath string) (*template.Template, []string, error) {
	var directories []string
	var filePaths []string

	// Get all directories on /templates and check if there's repeated files
	err := filepath.Walk(templatesPath, func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() {
			// Is file
			filename := info.Name()
			hasRepeatedFilePaths := contains(filePaths, path)
			if hasRepeatedFilePaths {
				return fmt.Errorf("you can't have repeated template files: %s", filename)
			}
			filePaths = append(filePaths, path)
		} else {
			// Is directory
			directories = append(directories, path)
		}

		return nil
	})
	if err != nil {
		return nil, nil, err
	}

	// a template for parsing all directories
	// The below line requires to have .tmpl file in every folder, so not using parseBlob because of that.
	//tmpl := template.Must(template.ParseGlob(templatesPath + templateExtensionPattern))
	tmpl := template.Must(template.ParseFiles(filePaths...))

	// Parse all directories (minus the templatesPath directory)
	for _, path := range directories[1:] {
		gotTemplates, err2 := hasTemplates(path)
		if err2 != nil {
			return nil, nil, err2
		}
		if gotTemplates {
			pattern := path + templateExtensionPattern
			template.Must(tmpl.ParseGlob(pattern))
		}
	}

	return tmpl, filePaths, nil
}

func contains(filePaths []string, filePathName string) bool {
	for _, f := range filePaths {
		if f == filePathName {
			return true
		}
	}
	return false
}

// TemplateRunner runs templates parser to generate a project with config passed
func TemplateRunner(templatesPath string, coreProject *core.Project, node node.Node) error {
	projectDirectory := utils.GetProjectDirectoryName(coreProject.Name)
	// create node directory in projectDirectory depicting a subproject
	nodeDirectoryName := projectDirectory + "/" + node.ConsumerData.Name
	if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
		return err
	}

	//copy relevant files from templates based on config received
	if node.ConsumerData.IsServer {
		for _, serverType := range node.ConsumerData.ServerTypes {
			s := serverType.Config["TYPE"]
			fmt.Println(s)
			p := serverType.Config["PROTOCOL"]
			fmt.Println(p)
			port := serverType.Config["PORT"]
			fmt.Println(port)
		}
	}

	if node.ConsumerData.IsClient {
		// extract server ports and source - needed this for url
		m := getEdgeInfoForNode(coreProject.CompageYaml.Edges, node)
		fmt.Println(m)
	}

	// generate go code now
	data := map[string]string{
		"Name":      "John Doe",
		"Job":       "Software Engineer",
		"Education": "BTech",
	}

	// parse the new file structure
	parsedTemplates, filePaths, err := ParseTemplates(templatesPath)
	if err != nil {
		return err
	}

	for _, filePathName := range filePaths {
		// ignore paths like .git and .idea
		if !utils.IgnorablePaths(filePathName) {
			// convert path from /templates/compage-template-langauge to /project-name/node structure
			targetFilePath := strings.Replace(filePathName[:strings.LastIndex(filePathName, substrString)], templatesPath, "", -1)
			// nodeDirectoryName is a node directory and attach targetFilePath to node path now.
			fileNameDirectoryPath := nodeDirectoryName + targetFilePath
			// check for directory existence and if not, create a new one
			_, err = os.Stat(fileNameDirectoryPath)
			if os.IsNotExist(err) {
				err = os.MkdirAll(fileNameDirectoryPath, os.ModePerm)
				if err != nil {
					return err
				}
			}
			// extract just file Name excluding the `/`
			fileName := filePathName[strings.LastIndex(filePathName, substrString)+1:]
			var newFile string
			if targetFilePath != "" {
				// new structure to form new path
				newFile = nodeDirectoryName + targetFilePath + "/" + fileName
			} else {
				newFile = nodeDirectoryName + "/" + fileName
			}
			// open/create file
			createdFile, err2 := os.Create(strings.TrimSuffix(newFile, templateExtension))
			if err2 != nil {
				return err2
			}
			if err2 = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err2 != nil {
				return err2
			}
		}
	}

	return nil
}

func hasTemplates(directoryName string) (bool, error) {
	d, err := os.Open(directoryName)
	if err != nil {
		return false, err
	}
	defer func(d *os.File) {
		_ = d.Close()
	}(d)

	files, err := d.Readdir(-1)
	if err != nil {
		return false, err
	}

	for _, file := range files {
		if file.Mode().IsRegular() {
			if filepath.Ext(file.Name()) == templateExtension {
				return true, nil
			}
		}
	}
	return false, nil
}
