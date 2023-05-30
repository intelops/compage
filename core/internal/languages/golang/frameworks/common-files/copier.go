package commonfiles

import (
	"github.com/gertd/go-pluralize"
	"github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/languages/executor"
	"github.com/intelops/compage/core/internal/utils"
	"strings"
)

const MainGoFile = "main.go.tmpl"
const GitIgnoreFile = ".gitignore.tmpl"
const GoSumFile = "go.sum.tmpl"
const GoModFile = "go.mod.tmpl"
const ReadMeMdFile = "README.md.tmpl"
const UsefulCommandsFile = "useful-commands.tmpl"

// Copier Language specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsGrpcServer      bool
	IsGrpcClient      bool
	GrpcServerPort    string
	IsRestServer      bool
	IsRestClient      bool
	RestServerPort    string
	RestResources     []node.Resource
	GrpcResources     []node.Resource
	RestClients       []languages.GrpcClient
	GrpcClients       []languages.GrpcClient
	PluralizeClient   *pluralize.Client
}

type resourceData struct {
	SmallResourceNameSingular string
	SmallResourceNamePlural   string
	CapsResourceNameSingular  string
	CapsResourceNamePlural    string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isGrpcServer bool, grpcServerPort string, isRestSQLDB bool, restSqlDB string, isGrpcSQLDB bool, grpcSqlDB string, restResources []node.Resource, grpcResources []node.Resource, restClients []languages.RestClient, grpcClients []languages.GrpcClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}
	// set all grpcResources for main.go.tmpl
	var grpcResourcesData []resourceData
	for _, r := range grpcResources {
		grpcResourcesData = append(grpcResourcesData, resourceData{
			SmallResourceNameSingular: strings.ToLower(r.Name),
			SmallResourceNamePlural:   pluralizeClient.Plural(strings.ToLower(r.Name)),
			CapsResourceNameSingular:  r.Name,
			CapsResourceNamePlural:    pluralizeClient.Plural(r.Name),
		})
	}
	data["GrpcResources"] = grpcResourcesData
	data["GrpcServerPort"] = grpcServerPort
	data["IsGrpcServer"] = isGrpcServer
	// if grpcClients slice has elements
	isGrpcClient := len(grpcClients) > 0
	data["IsGrpcClient"] = isGrpcClient

	// set all grpcResources for main.go.tmpl
	var restResourcesData []resourceData
	for _, r := range restResources {
		restResourcesData = append(restResourcesData, resourceData{
			SmallResourceNameSingular: strings.ToLower(r.Name),
			SmallResourceNamePlural:   pluralizeClient.Plural(strings.ToLower(r.Name)),
			CapsResourceNameSingular:  r.Name,
			CapsResourceNamePlural:    pluralizeClient.Plural(r.Name),
		})
	}
	data["RestResources"] = restResourcesData
	data["RestServerPort"] = restServerPort
	data["IsRestServer"] = isRestServer
	// if restClients slice has elements
	isRestClient := len(restClients) > 0
	data["IsRestClient"] = isRestClient

	data["IsRestSQLDB"] = isRestSQLDB
	if isRestSQLDB {
		data["RestSQLDB"] = restSqlDB
	}

	data["IsGrpcSQLDB"] = isGrpcSQLDB
	if isGrpcSQLDB {
		data["GrpcSQLDB"] = grpcSqlDB
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsGrpcServer:      isGrpcServer,
		IsGrpcClient:      isGrpcClient,
		GrpcServerPort:    grpcServerPort,
		RestServerPort:    restServerPort,
		IsRestServer:      isRestServer,
		IsRestClient:      isRestClient,
		GrpcResources:     grpcResources,
		GrpcClients:       grpcClients,
		RestResources:     restResources,
		PluralizeClient:   pluralizeClient,
	}
}

// CreateCommonFiles creates/copies relevant files to generated project
func (c Copier) CreateCommonFiles() error {
	var filePaths []string
	targetMainGoFileName := c.NodeDirectoryName + "/" + MainGoFile
	_, err := utils.CopyFile(targetMainGoFileName, c.TemplatesRootPath+"/"+MainGoFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetMainGoFileName)

	targetReadMeMdFileName := c.NodeDirectoryName + "/" + ReadMeMdFile
	_, err = utils.CopyFile(targetReadMeMdFileName, c.TemplatesRootPath+"/"+ReadMeMdFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetReadMeMdFileName)

	targetGoModFileName := c.NodeDirectoryName + "/" + GoModFile
	_, err = utils.CopyFile(targetGoModFileName, c.TemplatesRootPath+"/"+GoModFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetGoModFileName)

	targetGoSumFileName := c.NodeDirectoryName + "/" + GoSumFile
	_, err = utils.CopyFile(targetGoSumFileName, c.TemplatesRootPath+"/"+GoSumFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetGoSumFileName)

	targetGitIgnoreFileName := c.NodeDirectoryName + "/" + GitIgnoreFile
	_, err = utils.CopyFile(targetGitIgnoreFileName, c.TemplatesRootPath+"/"+GitIgnoreFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetGitIgnoreFileName)

	targetUsefulCommandsFileName := c.NodeDirectoryName + "/" + UsefulCommandsFile
	_, err = utils.CopyFile(targetUsefulCommandsFileName, c.TemplatesRootPath+"/"+UsefulCommandsFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetUsefulCommandsFileName)

	return executor.Execute(filePaths, c.Data)
}
