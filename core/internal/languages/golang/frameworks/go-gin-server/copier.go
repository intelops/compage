package goginserver

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
)

const RestServerPath = "/pkg/rest/server"
const RestClientPath = "/pkg/rest/client"

const DaosPath = RestServerPath + "/daos"
const SQLDBClientsPath = DaosPath + "/clients/sqls"

const ServicesPath = RestServerPath + "/services"
const ControllersPath = RestServerPath + "/controllers"
const ModelsPath = RestServerPath + "/models"

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
	IsRestServer      bool
	IsRestClient      bool
	SQLDB             string
	IsSQLDB           bool
	RestServerPort    string
	Resources         []*corenode.Resource
	RestClients       []*corenode.RestClient
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

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isSQLDB bool, sqlDB string, resources []*corenode.Resource, restClients []*corenode.RestClient) *Copier {

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
	if isRestServer {
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
		data["RestResources"] = resourcesData
		data["RestServerPort"] = restServerPort
		data["IsRestServer"] = isRestServer
	}
	// if restClients slice has elements
	isRestClient := len(restClients) > 0
	data["IsRestClient"] = isRestClient

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsRestServer:      isRestServer,
		IsRestClient:      isRestClient,
		SQLDB:             sqlDB,
		IsSQLDB:           isSQLDB,
		Resources:         resources,
		RestClients:       restClients,
		PluralizeClient:   pluralizeClient,
	}
}

// createRestClientDirectories creates rest client directories.
func (c Copier) createRestClientDirectories() error {
	clientDirectory := c.NodeDirectoryName + RestClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

// createRestServerDirectories creates rest server directories.
func (c Copier) createRestServerDirectories() error {
	controllersDirectory := c.NodeDirectoryName + ControllersPath
	modelsDirectory := c.NodeDirectoryName + ModelsPath
	servicesDirectory := c.NodeDirectoryName + ServicesPath
	daosDirectory := c.NodeDirectoryName + DaosPath
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
		resources := c.Data["RestResources"].([]resourceData)
		for _, r := range resources {
			resourceClientDirectory := c.NodeDirectoryName + SQLDBClientsPath + "/" + r.SmallKebabCaseResourceNameSingular + "-client"
			if err := utils.CreateDirectories(resourceClientDirectory); err != nil {
				return err
			}
		}
	}
	return nil
}

// copyRestServerResourceFiles copies rest server resource files from template and renames them as per resource config.
func (c Copier) copyRestServerResourceFiles(resource *corenode.Resource) error {
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

	// add resource specific data to map in c needed for templates.
	err = c.addResourceSpecificTemplateData(resource)
	if err != nil {
		return err
	}

	// apply template
	return executor.Execute(filePaths, c.Data)
}

// copyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (c Copier) copyRestClientResourceFiles(restClient *corenode.RestClient) error {
	/// add resource specific data to map in c needed for templates.
	c.Data["RestClientPort"] = restClient.Port
	c.Data["RestClientServiceName"] = restClient.SourceNodeName

	// copy restClient files to generated project.
	targetResourceClientFileName := c.NodeDirectoryName + RestClientPath + "/" + restClient.SourceNodeName + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+RestClientPath+"/"+ClientFile)
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
	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		fields[key] = value
	}
	c.Data["Fields"] = fields
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

// CreateRestConfigs creates/copies relevant files to generated project
func (c Copier) CreateRestConfigs() error {
	if err := c.CreateRestServer(); err != nil {
		return err
	}
	if err := c.CreateRestClients(); err != nil {
		return err
	}
	return nil
}

// CreateRestServer creates/copies relevant files to generated project
func (c Copier) CreateRestServer() error {
	// if the node is server, add server code
	if c.IsRestServer {
		// create directories for controller, service, dao, models
		if err := c.createRestServerDirectories(); err != nil {
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range c.Resources {
			if err := c.copyRestServerResourceFiles(resource); err != nil {
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
			}
		}
	}
	return nil
}

// CreateRestClients creates/copies relevant files to generated project
func (c Copier) CreateRestClients() error {
	// if the node is client, add client code
	if c.IsRestClient {
		// create directories for client
		if err := c.createRestClientDirectories(); err != nil {
			return err
		}

		// copy files with respect to the names of resources
		for _, client := range c.RestClients {
			if err := c.copyRestClientResourceFiles(client); err != nil {
				return err
			}
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
