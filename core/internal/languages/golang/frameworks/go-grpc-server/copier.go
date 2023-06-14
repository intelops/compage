package gogrpcserver

import (
	"errors"
	"github.com/gertd/go-pluralize"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages/executor"
	commonUtils "github.com/intelops/compage/core/internal/languages/utils"
	"github.com/intelops/compage/core/internal/utils"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"strings"
	"text/template"
)

const APIPath = "/api/v1"

const GrpcServerPath = "/pkg/grpc/server"
const GrpcClientPath = "/pkg/grpc/client"

const DaosPath = GrpcServerPath + "/daos"
const SQLDBClientsPath = DaosPath + "/clients/sqls"

// const NoSqlDbClientsPath = DaosPath + "/clients/nosql"

const ServicesPath = GrpcServerPath + "/services"
const ControllersPath = GrpcServerPath + "/controllers"
const ModelsPath = GrpcServerPath + "/models"

const APIProtoFile = "api.proto.tmpl"
const ControllerFile = "controller.go.tmpl"
const ServiceFile = "service.go.tmpl"
const DaoFile = "dao.go.tmpl"
const MySQLDaoFile = "mysql-dao.go.tmpl"
const SqliteDaoFile = "sqlite-dao.go.tmpl"
const MySQLDBClientFile = "mysql-client.go.tmpl"
const SqliteDBClientFile = "sqlite-client.go.tmpl"
const MySQLDBConfigFile = "mysql.go.tmpl"
const SqliteDBConfigFile = "sqlite.go.tmpl"
const ModelFile = "model.go.tmpl"

const ClientFile = "client.go.tmpl"

const Sqlite = "SQLite"
const MySQL = "MySQL"

// Copier Language specific copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsGrpcServer      bool
	HasGrpcClients    bool
	SQLDB             string
	IsSQLDB           bool
	GrpcServerPort    string
	Resources         []*corenode.Resource
	GrpcClients       []*corenode.GrpcClient
	PluralizeClient   *pluralize.Client
}

type resourceData struct {
	SmallKebabCaseResourceNameSingular string
	SmallSnakeCaseResourceNameSingular string
	SmallResourceNameSingular          string
	SmallResourceNamePlural            string
	CapsResourceNameSingular           string
	CapsResourceNamePlural             string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isGrpcServer bool, grpcServerPort string, isSQLDB bool, sqlDB string, resources []*corenode.Resource, grpcClients []*corenode.GrpcClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}
	data["SQLDB"] = sqlDB
	data["IsSQLDB"] = isSQLDB
	// set all resources for main.go.tmpl
	if isGrpcServer {
		var resourcesData []resourceData
		for _, r := range resources {
			lowerCamelResourceName := strcase.ToLowerCamel(r.Name)
			resourcesData = append(resourcesData, resourceData{
				SmallKebabCaseResourceNameSingular: strcase.ToKebab(r.Name),
				SmallSnakeCaseResourceNameSingular: strcase.ToSnake(r.Name),
				SmallResourceNameSingular:          lowerCamelResourceName,
				SmallResourceNamePlural:            pluralizeClient.Plural(lowerCamelResourceName),
				CapsResourceNameSingular:           r.Name,
				CapsResourceNamePlural:             pluralizeClient.Plural(r.Name),
			})
		}
		data["GrpcResources"] = resourcesData
		data["GrpcServerPort"] = grpcServerPort
		data["IsGrpcServer"] = isGrpcServer
	}
	// if grpcClients slice has elements
	hasGrpcClients := len(grpcClients) > 0
	data["HasGrpcClients"] = hasGrpcClients

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsGrpcServer:      isGrpcServer,
		HasGrpcClients:    hasGrpcClients,
		SQLDB:             sqlDB,
		IsSQLDB:           isSQLDB,
		Resources:         resources,
		GrpcClients:       grpcClients,
		PluralizeClient:   pluralizeClient,
	}
}

// createGrpcClientDirectories creates grpc client directories.
func (c Copier) createGrpcClientDirectories() error {
	clientDirectory := c.NodeDirectoryName + GrpcClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

// createGrpcServerDirectories creates grpc server directories.
func (c Copier) createGrpcServerDirectories() error {
	apiDirectory := c.NodeDirectoryName + APIPath
	controllersDirectory := c.NodeDirectoryName + ControllersPath
	modelsDirectory := c.NodeDirectoryName + ModelsPath
	servicesDirectory := c.NodeDirectoryName + ServicesPath
	daosDirectory := c.NodeDirectoryName + DaosPath
	if err := utils.CreateDirectories(apiDirectory); err != nil {
		return err
	}
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
	// create directories for every resource's db client.
	if c.IsSQLDB {
		sqlDBClientsDirectory := c.NodeDirectoryName + SQLDBClientsPath
		if err := utils.CreateDirectories(sqlDBClientsDirectory); err != nil {
			return err
		}
		resources := c.Data["GrpcResources"].([]resourceData)
		for _, r := range resources {
			resourceClientDirectory := c.NodeDirectoryName + SQLDBClientsPath + "/" + r.SmallKebabCaseResourceNameSingular + "-client"
			if err := utils.CreateDirectories(resourceClientDirectory); err != nil {
				return err
			}
		}
	}
	return nil
}

// copyGrpcServerResourceFiles copies grpc server resource files from template and renames them as per resource config.
func (c Copier) copyGrpcServerResourceFiles(resource *corenode.Resource) error {
	var filePaths []string
	resourceName := strcase.ToKebab(resource.Name)

	// copy controller files to generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + ControllerFile
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		return err
	}
	filePaths = append(filePaths, targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + ModelFile
	_, err0 := utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+ModelFile)
	if err0 != nil {
		return err0
	}
	filePaths = append(filePaths, targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + ServiceFile
	_, err1 := utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+ServiceFile)
	if err1 != nil {
		return err1
	}
	filePaths = append(filePaths, targetResourceServiceFileName)

	// copy dao files to generated project
	// add database config here
	var targetResourceDaoFileName string
	targetResourceSQLDBClientFileName := ""
	if c.IsSQLDB {
		if c.SQLDB == Sqlite {
			// client files
			targetResourceSQLDBClientFileName = c.NodeDirectoryName + SQLDBClientsPath + "/" + resourceName + "-client" + "/" + SqliteDBClientFile
			_, err2 := utils.CopyFile(targetResourceSQLDBClientFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+SqliteDBClientFile)
			if err2 != nil {
				return err2
			}
			filePaths = append(filePaths, targetResourceSQLDBClientFileName)
			// dao files
			targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + SqliteDaoFile
			_, err2 = utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+SqliteDaoFile)
			if err2 != nil {
				return err2
			}
			filePaths = append(filePaths, targetResourceDaoFileName)
		} else if c.SQLDB == MySQL {
			// client files
			targetResourceSQLDBClientFileName = c.NodeDirectoryName + SQLDBClientsPath + "/" + resourceName + "-client" + "/" + MySQLDBClientFile
			_, err2 := utils.CopyFile(targetResourceSQLDBClientFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+MySQLDBClientFile)
			if err2 != nil {
				return err2
			}
			filePaths = append(filePaths, targetResourceSQLDBClientFileName)

			// dao files
			targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + MySQLDaoFile
			_, err2 = utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MySQLDaoFile)
			if err2 != nil {
				return err2
			}
			filePaths = append(filePaths, targetResourceDaoFileName)
		}
	} else {
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
		_, err2 := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+DaoFile)
		if err2 != nil {
			return err2
		}
		filePaths = append(filePaths, targetResourceDaoFileName)
	}

	// add api.proto file for the resource.
	targetResourceAPIFileName := c.NodeDirectoryName + APIPath + "/" + resourceName + "-" + APIProtoFile
	_, err2 := utils.CopyFile(targetResourceAPIFileName, c.TemplatesRootPath+APIPath+"/"+APIProtoFile)
	if err2 != nil {
		return err2
	}
	// this function increments message fields number (grpc message)
	funcMap := template.FuncMap{
		"incCount": func(count int) int {
			return count + 2
		},
	}
	filePaths = append(filePaths, targetResourceAPIFileName)

	// add resource specific data to map in c needed for templates.
	err = c.addResourceSpecificTemplateData(resource)
	if err != nil {
		return err
	}

	// apply template
	return executor.ExecuteWithFuncs(filePaths, c.Data, funcMap)
}

// CopyGrpcClientResourceFiles copies grpc client files from template and renames them as per client config.
func (c Copier) CopyGrpcClientResourceFiles(grpcClient *corenode.GrpcClient) error {
	/// add resource specific data to map in c needed for templates.
	// TODO grpcClient needs too many changes (like referring the .proto and generated files) we can better just have a client created for local grpcServer)
	c.Data["GrpcClientPort"] = grpcClient.Port
	c.Data["GrpcClientServiceName"] = grpcClient.SourceNodeName
	c.Data["GrpcClientSourceNodeID"] = strings.Replace(cases.Title(language.Und, cases.NoLower).String(grpcClient.SourceNodeID), "-", "_", -1)
	// copy grpcClient files to generated project.
	targetResourceClientFileName := c.NodeDirectoryName + GrpcClientPath + "/" + grpcClient.SourceNodeName + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+GrpcClientPath+"/"+ClientFile)
	if err != nil {
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}

func (c Copier) addResourceSpecificTemplateData(resource *corenode.Resource) error {
	// make every field public by making its first character capital.
	fields := map[string]string{}
	// this slice is needed for grpc resource message generation
	var fieldNames []string
	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		fields[key] = commonUtils.GetProtoBufDataType(value)
		fieldNames = append(fieldNames, key)
	}
	c.Data["Fields"] = fields
	c.Data["FieldNames"] = fieldNames
	// db fields
	if c.IsSQLDB {
		createQueryColumns := map[string]string{}
		var insertQueryColumns string
		var insertQueryParams string
		var insertQueryExecColumns string
		var updateQueryColumnsAndParams string
		var updateQueryExecColumns string
		var getQueryScanColumns string

		for key, value := range resource.Fields {
			key = cases.Title(language.Und, cases.NoLower).String(key)
			dbDataType, err := c.getDBDataType(value)
			if err != nil {
				return err
			}
			createQueryColumns[key] = dbDataType
			if len(insertQueryColumns) > 0 {
				insertQueryColumns += ", " + cases.Title(language.Und, cases.NoLower).String(key)
				insertQueryParams += ", ?"
				// m here is a model's variable
				insertQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key)
			} else {
				insertQueryColumns = cases.Title(language.Und, cases.NoLower).String(key)
				insertQueryParams = "?"
				// m here is a model's variable
				insertQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key)
			}
			if len(updateQueryColumnsAndParams) > 0 {
				updateQueryColumnsAndParams += ", " + cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
				// m here is a model's variable
				updateQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key)
			} else {
				updateQueryColumnsAndParams = cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
				// m here is a model's variable
				updateQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key)
			}

			if len(getQueryScanColumns) > 0 {
				// m here is a model's variable
				getQueryScanColumns += ", &m." + cases.Title(language.Und, cases.NoLower).String(key)
			} else {
				// m here is a model's variable
				getQueryScanColumns = "&m." + cases.Title(language.Und, cases.NoLower).String(key)
			}
		}
		// create query columns
		c.Data["CreateQueryColumns"] = createQueryColumns

		// insert query columns and params
		c.Data["InsertQueryColumns"] = insertQueryColumns
		c.Data["InsertQueryParams"] = insertQueryParams
		c.Data["InsertQueryExecColumns"] = insertQueryExecColumns

		// update query columns and params, execColumns
		c.Data["UpdateQueryColumnsAndParams"] = updateQueryColumnsAndParams
		c.Data["UpdateQueryExecColumns"] = updateQueryExecColumns

		// get query columns and params
		c.Data["GetQueryExecColumns"] = getQueryScanColumns
	}

	lowerCamelResourceName := strcase.ToLowerCamel(resource.Name)
	// Add another map with below keys at root level (this is for specific resource for this iteration)
	c.Data["SmallKebabCaseResourceNameSingular"] = strcase.ToKebab(resource.Name)
	c.Data["SmallSnakeCaseResourceNameSingular"] = strcase.ToSnake(resource.Name)
	c.Data["SmallResourceNameSingular"] = lowerCamelResourceName
	c.Data["SmallResourceNamePlural"] = c.PluralizeClient.Plural(lowerCamelResourceName)
	c.Data["CapsResourceNameSingular"] = resource.Name
	c.Data["CapsResourceNamePlural"] = c.PluralizeClient.Plural(resource.Name)
	return nil
}

// CreateGrpcConfigs creates/copies relevant files to generated project
func (c Copier) CreateGrpcConfigs() error {
	if err := c.CreateGrpcServer(); err != nil {
		return err
	}
	if err := c.CreateGrpcClients(); err != nil {
		return err
	}
	return nil
}

// CreateGrpcServer creates/copies relevant files to generated project
func (c Copier) CreateGrpcServer() error {
	// if the node is server, add server code
	if c.IsGrpcServer {
		// create directories for controller, service, dao[for every resource's db clients], models
		if err := c.createGrpcServerDirectories(); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range c.Resources {
			if err := c.copyGrpcServerResourceFiles(resource); err != nil {
				return err
			}
		}
		// create sql db config file (common to all resources for specific database)
		// No vars in config file as of now but in future they may be there.
		if c.IsSQLDB {
			if c.SQLDB == Sqlite {
				var filePaths []string
				// client files
				targetSQLiteConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + SqliteDBConfigFile
				_, err2 := utils.CopyFile(targetSQLiteConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+SqliteDBConfigFile)
				if err2 != nil {
					return err2
				}
				filePaths = append(filePaths, targetSQLiteConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else if c.SQLDB == MySQL {
				var filePaths []string
				// client files
				targetMySQLConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + MySQLDBConfigFile
				_, err2 := utils.CopyFile(targetMySQLConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+MySQLDBConfigFile)
				if err2 != nil {
					return err2
				}
				filePaths = append(filePaths, targetMySQLConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else {
				return errors.New("database not supported")
			}
		}
	}
	return nil
}

// CreateGrpcClients creates/copies relevant files to generated project
func (c Copier) CreateGrpcClients() error {
	// create directories for client
	if err := c.createGrpcClientDirectories(); err != nil {
		return err
	}
	// if the node is client, add client code
	//if c.HasGrpcClients {
	// copy files with respect to the names of resources
	// TODO need to add a flow based on client details.
	//for _, client := range c.GrpcClients {
	//	if err := c.CopyGrpcClientResourceFiles(client); err != nil {
	//		return err
	//	}
	//}
	//}
	if c.IsGrpcServer {
		// create self client
		if err := c.copySelfGrpcClientResourceFiles(); err != nil {
			return err
		}
	}

	return nil
}

// CreateRootLevelFiles copies all root level files at language template.
func (c Copier) CreateRootLevelFiles() error {
	err := utils.CopyFiles(c.NodeDirectoryName, c.TemplatesRootPath)
	if err != nil {
		return err
	}
	_, files, err0 := utils.GetDirectoriesAndFilePaths(c.NodeDirectoryName)
	if err0 != nil {
		return err0
	}
	return executor.Execute(files, c.Data)
}

func (c Copier) getDBDataType(value string) (string, error) {
	if c.SQLDB == Sqlite {
		return commonUtils.GetSqliteDataType(value), nil
	} else if c.SQLDB == MySQL {
		return commonUtils.GetMySQLDataType(value), nil
	}
	return "", errors.New("database not supported")
}

func (c Copier) copySelfGrpcClientResourceFiles() error {
	targetResourceClientFileName := c.NodeDirectoryName + GrpcClientPath + "/ping-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+GrpcClientPath+"/"+ClientFile)
	if err != nil {
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}
