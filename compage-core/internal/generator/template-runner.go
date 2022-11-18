package generator

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/languages/golang"
	"github.com/kube-tarian/compage-core/internal/utils"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// ParseTemplates parse.go
func ParseTemplates(nodeDirectoryName string) (*template.Template, []string, error) {
	filePaths, directories, err := getDirectoriesAndFilePaths(nodeDirectoryName)
	if err != nil {
		return nil, nil, err
	}

	// a template for parsing all directories
	// The below line requires to have .tmpl file in every folder, so not using parseBlob because of that.
	//tmpl := template.Must(template.ParseGlob(nodeDirectoryName + templateExtensionPattern))
	tmpl := template.Must(template.ParseFiles(filePaths...))

	// Parse all directories (minus the nodeDirectoryName directory)
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

func getDirectoriesAndFilePaths(templatesPath string) ([]string, []string, error) {
	var directories []string
	var filePaths []string

	// Get all directories on /templates and check if there's repeated files
	err := filepath.Walk(templatesPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
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
	return filePaths, directories, err
}

func contains(filePaths []string, filePathName string) bool {
	for _, f := range filePaths {
		if f == filePathName {
			return true
		}
	}
	return false
}

// GoTemplateRunner runs templates parser to generate a project with config passed
func GoTemplateRunner(coreProject *core.Project, goNode *golang.GoNode) error {
	// generateProject - copy relevant files from template
	nodeDirectoryName, err := copyRelevantFiles(coreProject, goNode)
	if err != nil {
		return err
	}

	// parse the new file structure
	parsedTemplates, filePaths, err := ParseTemplates(nodeDirectoryName)
	if err != nil {
		return err
	}

	for _, filePathName := range filePaths {
		// ignore paths like .git and .idea
		if !utils.IgnorablePaths(filePathName) {
			// generate go code now
			data := map[string]string{
				"Name":      "John Doe",
				"Job":       "Software Engineer",
				"Education": "BTech",
			}

			fileName := filePathName[strings.LastIndex(filePathName, substrString)+1:]
			createdFile, err := os.Create(nodeDirectoryName + strings.TrimSuffix(filePathName, templateExtension))
			if err != nil {
				return err
			}
			if err = parsedTemplates.ExecuteTemplate(createdFile, fileName, data); err != nil {
				return err
			}
		}
	}

	return nil
}

func funcName(filePathName string, nodeDirectoryName string) (string, *os.File, error) {
	// convert path from /templates/compage-template-langauge to /project-name/node structure
	targetFilePath := strings.Replace(filePathName[:strings.LastIndex(filePathName, substrString)], nodeDirectoryName, "", -1)
	// nodeDirectoryName is a node directory and attach targetFilePath to node path now.
	fileNameDirectoryPath := nodeDirectoryName + targetFilePath
	// check for directory existence and if not, create a new one
	_, err := os.Stat(fileNameDirectoryPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(fileNameDirectoryPath, os.ModePerm)
		if err != nil {
			return "", nil, err
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
	createdFile, err := os.Create(strings.TrimSuffix(newFile, templateExtension))
	if err != nil {
		return "", nil, err
	}
	return fileName, createdFile, err
}

func CopyDir(src string, dest string) error {
	//if dest[:len(src)] == src {
	//	return fmt.Errorf("cannot copy a folder into the folder itself")
	//}
	f, err := os.Open(src)
	if err != nil {
		return err
	}
	file, err := f.Stat()
	if err != nil {
		return err
	}
	if !file.IsDir() {
		return fmt.Errorf("Source " + file.Name() + " is not a directory!")
	}
	err = os.Mkdir(dest, 0755)
	if err != nil {
		return err
	}
	files, err := os.ReadDir(src)
	if err != nil {
		return err
	}
	for _, f := range files {
		if f.IsDir() {
			err = CopyDir(src+"/"+f.Name(), dest+"/"+f.Name())
			if err != nil {
				return err
			}
		}
		if !f.IsDir() {
			content, err := os.ReadFile(src + "/" + f.Name())
			if err != nil {
				return err
			}
			err = os.WriteFile(dest+"/"+f.Name(), content, 0755)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func copyRelevantFiles(coreProject *core.Project, goNode *golang.GoNode) (string, error) {
	projectDirectory := utils.GetProjectDirectoryName(coreProject.Name)
	// create node directory in projectDirectory depicting a subproject
	nodeDirectoryName := projectDirectory + "/" + goNode.ConsumerData.Name
	if err := utils.CreateDirectories(nodeDirectoryName); err != nil {
		return "", err
	}

	filePaths, directories, err := getDirectoriesAndFilePaths(golangTemplatesPath)
	if err != nil {
		return nodeDirectoryName, err
	}
	fmt.Println(filePaths)
	fmt.Println(directories)

	err = CopyDir(golangTemplatesPath, nodeDirectoryName)
	if err != nil {
		return nodeDirectoryName, err
	}

	//copy relevant files from templates based on config received
	//copy common files to templatesNodeDirectoryName
	//if goNode.ConsumerData.IsServer {
	//	for _, serverType := range goNode.ConsumerData.ServerTypes {
	//		s := serverType.Config["TYPE"]
	//		fmt.Println(s)
	//		p := serverType.Config["PROTOCOL"]
	//		fmt.Println(p)
	//		port := serverType.Config["PORT"]
	//		fmt.Println(port)
	//	}
	//} else if goNode.ConsumerData.IsClient {
	//	// extract server ports and source - needed this for url
	//	//m := getEdgeInfoForNode(coreProject.CompageYaml.Edges, node)
	//	//fmt.Println(m)
	//} else {
	//	//copy common files and removed from filePaths
	//
	//}

	return nodeDirectoryName, nil
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
