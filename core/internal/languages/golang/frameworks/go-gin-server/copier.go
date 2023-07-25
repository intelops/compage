package goginserver

import (
	"errors"
	"github.com/gertd/go-pluralize"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages/executor"
	commonUtils "github.com/intelops/compage/core/internal/languages/utils"
	log "github.com/sirupsen/logrus"
	"text/template"

	"github.com/intelops/compage/core/internal/utils"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"strings"
)

const RestServerPath = "/pkg/rest/server"
const RestClientPath = "/pkg/rest/client"

const DaosPath = RestServerPath + "/daos"
const SQLDBClientsPath = DaosPath + "/clients/sqls"
const NOSQLDBClientsPath = DaosPath + "/clients/nosqls"

const ServicesPath = RestServerPath + "/services"
const ControllersPath = RestServerPath + "/controllers"
const ModelsPath = RestServerPath + "/models"

const SQLControllerFile = "sqls-controller.go.tmpl"
const SQLServiceFile = "sqls-service.go.tmpl"
const NoSQLControllerFile = "nosqls-controller.go.tmpl"
const NoSQLServiceFile = "nosqls-service.go.tmpl"
const DaoFile = "dao.go.tmpl"
const MongoDBDaoFile = "mongodb-dao.go.tmpl"
const MySQLDaoFile = "mysql-dao.go.tmpl"
const SQLiteDaoFile = "sqlite-dao.go.tmpl"
const MongoDBConfigFile = "mongodb.go.tmpl"
const MySQLDBConfigFile = "mysql.go.tmpl"
const SQLiteDBConfigFile = "sqlite.go.tmpl"
const SQLModelFile = "sqls-model.go.tmpl"
const NoSQLModelFile = "nosqls-model.go.tmpl"

const ClientFile = "client.go.tmpl"

// MongoDB nosql databases
const MongoDB = "MongoDB"

// SQLite sql databases
const SQLite = "SQLite"
const MySQL = "MySQL"
const InMemory = "InMemory"

// Copier Language specific *Copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	HasRestClients    bool
	SQLDB             string
	IsSQLDB           bool
	NoSQLDB           string
	IsNoSQLDB         bool
	RestServerPort    string
	Resources         []*corenode.Resource
	RestClients       []*corenode.RestClient
	PluralizeClient   *pluralize.Client
}

type serverResourceData struct {
	SmallKebabCaseResourceNameSingular string
	SmallSnakeCaseResourceNameSingular string
	SmallResourceNameSingular          string
	SmallResourceNamePlural            string
	CapsResourceNameSingular           string
	CapsResourceNamePlural             string
}

func NewCopier(userName, repositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isSQLDB bool, sqlDB string, isNoSQLDB bool, noSQLDB string, resources []*corenode.Resource, restClients []*corenode.RestClient) *Copier {

	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"RepositoryName": repositoryName,
		"NodeName":       strings.ToLower(nodeName),
		"UserName":       userName,
	}
	data["SQLDB"] = sqlDB
	data["IsSQLDB"] = isSQLDB
	data["NoSQLDB"] = noSQLDB
	data["IsNoSQLDB"] = isNoSQLDB
	// set all resources for main.go.tmpl
	if isRestServer {
		var serverResourcesData []serverResourceData
		for _, r := range resources {
			lowerCamelResourceName := strcase.ToLowerCamel(r.Name)
			serverResourcesData = append(serverResourcesData, serverResourceData{
				SmallKebabCaseResourceNameSingular: strcase.ToKebab(r.Name),
				SmallSnakeCaseResourceNameSingular: strcase.ToSnake(r.Name),
				SmallResourceNameSingular:          lowerCamelResourceName,
				SmallResourceNamePlural:            pluralizeClient.Plural(lowerCamelResourceName),
				CapsResourceNameSingular:           r.Name,
				CapsResourceNamePlural:             pluralizeClient.Plural(r.Name),
			})
		}
		data["RestResources"] = serverResourcesData
		data["RestServerPort"] = restServerPort
		data["IsRestServer"] = isRestServer
	}
	// if restClients slice has elements
	hasRestClients := len(restClients) > 0

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsRestServer:      isRestServer,
		HasRestClients:    hasRestClients,
		SQLDB:             sqlDB,
		IsSQLDB:           isSQLDB,
		NoSQLDB:           noSQLDB,
		IsNoSQLDB:         isNoSQLDB,
		Resources:         resources,
		RestClients:       restClients,
		PluralizeClient:   pluralizeClient,
	}
}

// createRestClientDirectories creates rest client directories.
func (c *Copier) createRestClientDirectories() error {
	clientDirectory := c.NodeDirectoryName + RestClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		log.Debugf("error creating client directory: %v", err)
		return err
	}

	return nil
}

// createRestServerDirectories creates rest server directories.
func (c *Copier) createRestServerDirectories() error {
	controllersDirectory := c.NodeDirectoryName + ControllersPath
	modelsDirectory := c.NodeDirectoryName + ModelsPath
	servicesDirectory := c.NodeDirectoryName + ServicesPath
	daosDirectory := c.NodeDirectoryName + DaosPath
	if err := utils.CreateDirectories(controllersDirectory); err != nil {
		log.Debugf("error creating controllers directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(modelsDirectory); err != nil {
		log.Debugf("error creating models directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(servicesDirectory); err != nil {
		log.Debugf("error creating services directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(daosDirectory); err != nil {
		log.Debugf("error creating daos directory: %v", err)
		return err
	}
	// create directories for every resource's db client.
	if c.IsSQLDB {
		sqlDBClientsDirectory := c.NodeDirectoryName + SQLDBClientsPath
		if err := utils.CreateDirectories(sqlDBClientsDirectory); err != nil {
			log.Debugf("error creating sql db clients directory: %v", err)
			return err
		}
	}
	// create directories for every resource's db client.
	if c.IsNoSQLDB {
		noSQLDBClientsDirectory := c.NodeDirectoryName + NOSQLDBClientsPath
		if err := utils.CreateDirectories(noSQLDBClientsDirectory); err != nil {
			log.Debugf("error creating nosql db clients directory: %v", err)
			return err
		}
	}
	return nil
}

// copyRestServerResourceFiles copies rest server resource files from template and renames them as per resource config.
func (c *Copier) copyRestServerResourceFiles(resource *corenode.Resource) error {
	var filePaths []*string
	var err error
	resourceName := strcase.ToKebab(resource.Name)

	// copy sql controller/service/dao/models files to generated project
	if c.IsSQLDB {
		filePaths, err = c.copySQLDBResourceFiles(resourceName, filePaths)
		if err != nil {
			log.Debugf("error copying sql db resources: %v", err)
			return err
		}
	}

	// copy nosql controller/service/dao/models to generated project
	if c.IsNoSQLDB {
		filePaths, err = c.copyNoSQLDBResourceFiles(resourceName, filePaths)
		if err != nil {
			log.Debugf("error copying sql db resources: %v", err)
			return err
		}
	}

	// add resource specific data to map in c needed for templates.
	err = c.addResourceSpecificTemplateData(resource)
	if err != nil {
		log.Debugf("error adding resource specific template data: %v", err)
		return err
	}

	// get func map for template
	funcMap := c.getFuncMap(resource)

	// apply template
	return executor.ExecuteWithFuncs(filePaths, c.Data, funcMap)
}

func (c *Copier) getFuncMap(resource *corenode.Resource) template.FuncMap {
	funcMap := template.FuncMap{
		"ToLowerCamelCase": func(key string) string {
			return strcase.ToLowerCamel(key)
		},
		"AddPointerIfCompositeField": func(key string) string {
			fieldMetaData, ok := resource.Fields[key]
			if ok && fieldMetaData.IsComposite {
				return "*" + fieldMetaData.Type
			}
			return fieldMetaData.Type
		},
		"GetCompositeFields": func(key string) string {
			fieldMetaData, ok := resource.Fields[key]
			if ok && fieldMetaData.IsComposite {
				return key + ": &models." + fieldMetaData.Type + "{},"
			}
			return ""
		},
	}
	return funcMap
}

// copyRestClientResourceFiles copies rest client files from template and renames them as per client config.
func (c *Copier) copyRestClientResourceFiles(restClient *corenode.RestClient) error {
	/// add resource specific data to map in c needed for templates.
	c.Data["RestClientPort"] = restClient.Port
	c.Data["RestClientServiceName"] = restClient.SourceNodeName
	c.Data["RestClientSourceNodeID"] = strings.Replace(cases.Title(language.Und, cases.NoLower).String(restClient.SourceNodeID), "-", "", -1)

	// copy restClient files to generated project.
	targetResourceClientFileName := c.NodeDirectoryName + RestClientPath + "/" + restClient.SourceNodeName + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+RestClientPath+"/"+ClientFile)
	if err != nil {
		log.Debugf("error while copying rest client file %s", targetResourceClientFileName)
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}

func (c *Copier) addSQLDetails(resource *corenode.Resource) error {
	var createQueryColumns *string
	var insertQueryColumns *string
	var insertQueryParams *string
	var insertQueryExecColumns *string
	var updateQueryColumnsAndParams *string
	var updateQueryExecColumns *string
	var getQueryScanColumns *string

	for key, value := range resource.Fields {
		dbDataType, err := c.getSQLDBDataType(value.Type)
		if err != nil {
			log.Debugf("error while getting db data type for %s", value.Type)
			return err
		}
		createQueryColumns = c.getCreateQueryColumns(createQueryColumns, key, value, dbDataType)
		insertQueryColumns, insertQueryParams, insertQueryExecColumns = c.getQueryParamsNColumnsNExecColumns(insertQueryColumns, insertQueryParams, insertQueryExecColumns, key, value)
		updateQueryColumnsAndParams, updateQueryExecColumns = c.getUpdateQueryColumnsAndParamsNExecColumns(updateQueryColumnsAndParams, updateQueryExecColumns, key, value)
		getQueryScanColumns = c.getGetQueryScanColumns(getQueryScanColumns, key, value)
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
	return nil
}

func (c *Copier) getUpdateQueryColumnsAndParamsNExecColumns(updateQueryColumnsAndParams, updateQueryExecColumns *string, key string, value corenode.FieldMetadata) (*string, *string) {
	if updateQueryColumnsAndParams != nil {
		if value.IsComposite {
			*updateQueryColumnsAndParams += ", " + cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
			// m here is a model's variable
			*updateQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			*updateQueryColumnsAndParams += ", " + cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
			// m here is a model's variable
			*updateQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	} else {
		updateQueryColumnsAndParams = new(string)
		updateQueryExecColumns = new(string)
		if value.IsComposite {
			*updateQueryColumnsAndParams = cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
			// m here is a model's variable
			*updateQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			*updateQueryColumnsAndParams = cases.Title(language.Und, cases.NoLower).String(key) + " = ?"
			// m here is a model's variable
			*updateQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	}
	return updateQueryColumnsAndParams, updateQueryExecColumns
}

func (c *Copier) getQueryParamsNColumnsNExecColumns(insertQueryColumns, insertQueryParams, insertQueryExecColumns *string, key string, value corenode.FieldMetadata) (*string, *string, *string) {
	if insertQueryColumns != nil {
		if value.IsComposite {
			*insertQueryColumns += ", " + cases.Title(language.Und, cases.NoLower).String(key)
			*insertQueryParams += ", ?"
			// m here is a model's variable
			*insertQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			*insertQueryColumns += ", " + cases.Title(language.Und, cases.NoLower).String(key)
			*insertQueryParams += ", ?"
			// m here is a model's variable
			*insertQueryExecColumns += ", m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	} else {
		insertQueryParams = new(string)
		insertQueryColumns = new(string)
		insertQueryExecColumns = new(string)
		if value.IsComposite {
			*insertQueryColumns = cases.Title(language.Und, cases.NoLower).String(key)
			*insertQueryParams = "?"
			// m here is a model's variable
			*insertQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			*insertQueryColumns = cases.Title(language.Und, cases.NoLower).String(key)
			*insertQueryParams = "?"
			// m here is a model's variable
			*insertQueryExecColumns = "m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	}
	return insertQueryColumns, insertQueryParams, insertQueryExecColumns
}

func (c *Copier) getCreateQueryColumns(createQueryColumns *string, key string, value corenode.FieldMetadata, dbDataType string) *string {
	if createQueryColumns != nil {
		if value.IsComposite {
			*createQueryColumns += "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NULL,"
		} else {
			*createQueryColumns += "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NOT NULL,"
		}
	} else {
		createQueryColumns = new(string)
		if value.IsComposite {
			*createQueryColumns = "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NULL,"
		} else {
			*createQueryColumns = "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NOT NULL,"
		}
	}
	return createQueryColumns
}

func (c *Copier) getGetQueryScanColumns(getQueryScanColumns *string, key string, value corenode.FieldMetadata) *string {
	if getQueryScanColumns != nil {
		if value.IsComposite {
			// m here is a model's variable
			*getQueryScanColumns += ", &m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			// m here is a model's variable
			*getQueryScanColumns += ", &m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	} else {
		getQueryScanColumns = new(string)
		if value.IsComposite {
			// m here is a model's variable
			*getQueryScanColumns = "&m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			// m here is a model's variable
			*getQueryScanColumns = "&m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	}
	return getQueryScanColumns
}

func (c *Copier) addResourceSpecificTemplateData(resource *corenode.Resource) error {
	// make every field public by making its first character capital.
	fields := map[string]string{}
	for key, value := range resource.Fields {
		fields[key] = value.Type
	}
	c.Data["Fields"] = fields
	// db fields
	if c.IsSQLDB {
		err := c.addSQLDetails(resource)
		if err != nil {
			log.Debug("error while adding sql details to resource specific template data", err)
			return err
		}
	}

	// Add another map with below keys at root level (this is for specific resource for this iteration)
	lowerCamelResourceName := strcase.ToLowerCamel(resource.Name)
	c.Data["SmallKebabCaseResourceNameSingular"] = strcase.ToKebab(resource.Name)
	c.Data["SmallSnakeCaseResourceNameSingular"] = strcase.ToSnake(resource.Name)
	c.Data["SmallResourceNameSingular"] = lowerCamelResourceName
	c.Data["SmallResourceNamePlural"] = c.PluralizeClient.Plural(lowerCamelResourceName)
	c.Data["CapsResourceNameSingular"] = resource.Name
	c.Data["CapsResourceNamePlural"] = c.PluralizeClient.Plural(resource.Name)
	return nil
}

func (c *Copier) copyNoSQLDBResourceFiles(resourceName string, filePaths []*string) ([]*string, error) {
	// copy controller files to generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + strings.Replace(NoSQLControllerFile, "nosqls-", "", 1)
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+NoSQLControllerFile)
	if err != nil {
		log.Debugf("error copying controller file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(NoSQLModelFile, "nosqls-", "", 1)
	_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+NoSQLModelFile)
	if err != nil {
		log.Debugf("error copying model file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + strings.Replace(NoSQLServiceFile, "nosqls-", "", 1)
	_, err = utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+NoSQLServiceFile)
	if err != nil {
		log.Debugf("error copying service file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceServiceFileName)

	var targetResourceDaoFileName string
	if c.NoSQLDB == MongoDB {
		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + MongoDBDaoFile
		_, err = utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MongoDBDaoFile)
		if err != nil {
			log.Debugf("error copying mongodb dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	}

	return filePaths, nil
}

func (c *Copier) copySQLDBResourceFiles(resourceName string, filePaths []*string) ([]*string, error) {
	// copy controller files to generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + strings.Replace(SQLControllerFile, "sqls-", "", 1)
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+SQLControllerFile)
	if err != nil {
		log.Debugf("error copying controller file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLModelFile, "sqls-", "", 1)
	_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLModelFile)
	if err != nil {
		log.Debugf("error copying model file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + strings.Replace(SQLServiceFile, "sqls-", "", 1)
	_, err = utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+SQLServiceFile)
	if err != nil {
		log.Debugf("error copying service file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceServiceFileName)

	var targetResourceDaoFileName string
	if c.SQLDB == SQLite {
		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + SQLiteDaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+SQLiteDaoFile)
		if err != nil {
			log.Debugf("error copying sqlite dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == MySQL {
		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + MySQLDaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MySQLDaoFile)
		if err != nil {
			log.Debugf("error copying mysql dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == InMemory {
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+DaoFile)
		if err != nil {
			log.Debugf("error copying dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	}
	return filePaths, nil
}

// CreateRestConfigs creates/copies relevant files to generated project
func (c *Copier) CreateRestConfigs() error {
	if err := c.CreateRestServer(); err != nil {
		log.Debugf("error creating rest server: %v", err)
		return err
	}
	if err := c.CreateRestClients(); err != nil {
		log.Debugf("error creating rest clients: %v", err)
		return err
	}
	return nil
}

// CreateRestServer creates/copies relevant files to generated project
func (c *Copier) CreateRestServer() error {
	// if the node is server, add server code
	if c.IsRestServer {
		// create directories for controller, service, dao, models
		if err := c.createRestServerDirectories(); err != nil {
			log.Debugf("error creating rest server directories: %v", err)
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range c.Resources {
			if err := c.copyRestServerResourceFiles(resource); err != nil {
				log.Debugf("error copying rest server resource files: %v", err)
				return err
			}
		}
		// create sql db config file (common to all resources for specific database)
		// No vars in config file as of now but in future they may be there.
		if c.IsSQLDB {
			if c.SQLDB == SQLite {
				var filePaths []string
				// client files
				targetSQLiteConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + SQLiteDBConfigFile
				_, err2 := utils.CopyFile(targetSQLiteConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+SQLiteDBConfigFile)
				if err2 != nil {
					log.Debugf("error copying sqlite config file: %v", err2)
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
					log.Debugf("error copying mysql config file: %v", err2)
					return err2
				}
				filePaths = append(filePaths, targetMySQLConfigFileName)
				return executor.Execute(filePaths, c.Data)
			}
		}
		// create nosql db config file (common to all resources for specific database)
		// No vars in config file as of now but in future they may be there.
		if c.IsNoSQLDB {
			if c.NoSQLDB == MongoDB {
				var filePaths []string
				// client files
				targetMongoDBConfigFileName := c.NodeDirectoryName + NOSQLDBClientsPath + "/" + MongoDBConfigFile
				_, err2 := utils.CopyFile(targetMongoDBConfigFileName, c.TemplatesRootPath+NOSQLDBClientsPath+"/"+MongoDBConfigFile)
				if err2 != nil {
					log.Debugf("error copying mongodb config file: %v", err2)
					return err2
				}
				filePaths = append(filePaths, targetMongoDBConfigFileName)
				return executor.Execute(filePaths, c.Data)
			}
		}
	}
	return nil
}

// CreateRestClients creates/copies relevant files to generated project
func (c *Copier) CreateRestClients() error {
	// if the node is client, add client code
	if c.HasRestClients {
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
func (c *Copier) CreateRootLevelFiles() error {
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

func (c *Copier) getSQLDBDataType(value string) (string, error) {
	if c.SQLDB == SQLite {
		return commonUtils.GetSqliteDataType(value), nil
	} else if c.SQLDB == MySQL {
		return commonUtils.GetMySQLDataType(value), nil
	}
	return "", errors.New("database not supported")
}
