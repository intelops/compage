package commonfiles

import (
	"fmt"
	"github.com/gertd/go-pluralize"
	corenode "github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages/executor"
	commonUtils "github.com/intelops/compage/core/internal/languages/utils"
	"github.com/intelops/compage/core/internal/utils"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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
	HasGrpcClients    bool
	GrpcServerPort    string
	IsRestServer      bool
	HasRestClients    bool
	RestServerPort    string
	RestResources     []*corenode.Resource
	GrpcResources     []*corenode.Resource
	RestClients       []*corenode.RestClient
	GrpcClients       []*corenode.GrpcClient
	PluralizeClient   *pluralize.Client
}

type restResourceData struct {
	SmallResourceNameSingular string
	SmallResourceNamePlural   string
	CapsResourceNameSingular  string
	CapsResourceNamePlural    string
	ResourcePostBody          string
	ResourcePutBody           string
}

type grpcResourceData struct {
	SmallResourceNameSingular string
	SmallResourceNamePlural   string
	CapsResourceNameSingular  string
	CapsResourceNamePlural    string
}

type clientData struct {
	SourceNodeID string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isGrpcServer bool, grpcServerPort string, isRestSQLDB bool, restSQLDB string, isGrpcSQLDB bool, grpcSQLDB string, isRestNoSQLDB bool, restNoSQLDB string, isGrpcNoSQLDB bool, grpcNoSQLDB string, restResources []*corenode.Resource, grpcResources []*corenode.Resource, restClients []*corenode.RestClient, grpcClients []*corenode.GrpcClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}
	// set all grpcResources for main.go.tmpl
	var grpcResourcesData []grpcResourceData
	for _, r := range grpcResources {
		grpcResourcesData = append(grpcResourcesData, grpcResourceData{
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
	HasGrpcClients := len(grpcClients) > 0
	data["HasGrpcClients"] = HasGrpcClients

	// set all grpcResources for main.go.tmpl
	var restResourcesData []restResourceData
	for _, r := range restResources {
		restResourcesData = append(restResourcesData, restResourceData{
			SmallResourceNameSingular: strings.ToLower(r.Name),
			SmallResourceNamePlural:   pluralizeClient.Plural(strings.ToLower(r.Name)),
			CapsResourceNameSingular:  r.Name,
			CapsResourceNamePlural:    pluralizeClient.Plural(r.Name),
			ResourcePostBody:          getResourcePostBody(r),
			ResourcePutBody:           getResourcePutBody(r),
		})
	}
	data["RestResources"] = restResourcesData
	data["RestServerPort"] = restServerPort
	data["IsRestServer"] = isRestServer
	// if restClients slice has elements
	hasRestClients := len(restClients) > 0
	data["HasRestClients"] = hasRestClients
	data["HasRestClients"] = hasRestClients
	if hasRestClients {
		var d []clientData
		for _, restClient := range restClients {
			d = append(d, clientData{SourceNodeID: strings.Replace(cases.Title(language.Und, cases.NoLower).String(restClient.SourceNodeID), "-", "", -1)})
		}
		data["RestClients"] = d
	}

	data["IsRestSQLDB"] = isRestSQLDB
	if isRestSQLDB {
		data["RestSQLDB"] = restSQLDB
	}

	data["IsGrpcSQLDB"] = isGrpcSQLDB
	if isGrpcSQLDB {
		data["GrpcSQLDB"] = grpcSQLDB
	}

	data["IsRestNoSQLDB"] = isRestNoSQLDB
	if isRestNoSQLDB {
		data["RestNoSQLDB"] = restNoSQLDB
	}

	data["IsGrpcNoSQLDB"] = isGrpcNoSQLDB
	if isGrpcNoSQLDB {
		data["GrpcNoSQLDB"] = grpcNoSQLDB
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsGrpcServer:      isGrpcServer,
		HasGrpcClients:    HasGrpcClients,
		GrpcServerPort:    grpcServerPort,
		RestServerPort:    restServerPort,
		IsRestServer:      isRestServer,
		HasRestClients:    hasRestClients,
		GrpcResources:     grpcResources,
		GrpcClients:       grpcClients,
		RestResources:     restResources,
		PluralizeClient:   pluralizeClient,
	}
}

func getResourcePostBody(r *corenode.Resource) string {
	postBody := "{"
	for key, value := range r.Fields {
		var sprintf string
		if value.IsComposite {
			sprintf = fmt.Sprintf("\"%s\": {},", key)
		} else {
			if value.Type == "string" {
				sprintf = fmt.Sprintf("\"%s\": \"%v\",", key, commonUtils.GetDefaultValueForDataType(value.Type))
			} else {
				sprintf = fmt.Sprintf("\"%s\": %v,", key, commonUtils.GetDefaultValueForDataType(value.Type))
			}
		}
		postBody += sprintf
	}
	postBody = strings.TrimSuffix(postBody, ",")
	postBody += "}"
	return postBody
}

func getResourcePutBody(r *corenode.Resource) string {
	putBody := fmt.Sprintf("{\"%s\": %v,", "Id", 123)
	for key, value := range r.Fields {
		var sprintf string
		if value.IsComposite {
			sprintf = fmt.Sprintf("\"%s\": {},", key)
		} else {
			if value.Type == "string" {
				sprintf = fmt.Sprintf("\"%s\": \"%v\",", key, commonUtils.GetDefaultValueForDataType(value.Type))
			} else {
				sprintf = fmt.Sprintf("\"%s\": %v,", key, commonUtils.GetDefaultValueForDataType(value.Type))
			}
		}
		putBody += sprintf
	}
	putBody = strings.TrimSuffix(putBody, ",")
	putBody += "}"
	return putBody
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
