package gogrpcserver

import (
	"errors"
	"github.com/gertd/go-pluralize"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/core/internal/core/node"
	"github.com/intelops/compage/core/internal/languages/executor"
	commonUtils "github.com/intelops/compage/core/internal/languages/utils"
	"github.com/intelops/compage/core/internal/utils"
	log "github.com/sirupsen/logrus"
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
const MySQLDBConfigFile = "mysql.go.tmpl"
const SqliteDBConfigFile = "sqlite.go.tmpl"
const ModelFile = "model.go.tmpl"

const ClientFile = "client.go.tmpl"

const Sqlite = "SQLite"
const MySQL = "MySQL"

// Copier Language specific *Copier
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
func (c *Copier) createGrpcClientDirectories() error {
	clientDirectory := c.NodeDirectoryName + GrpcClientPath
	if err := utils.CreateDirectories(clientDirectory); err != nil {
		return err
	}

	return nil
}

// createGrpcServerDirectories creates grpc server directories.
func (c *Copier) createGrpcServerDirectories() error {
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
			log.Debugf("error creating sql db clients directory: %v", err)
			return err
		}
	}
	return nil
}

// copyGrpcServerResourceFiles copies grpc server resource files from template and renames them as per resource config.
func (c *Copier) copyGrpcServerResourceFiles(resource *corenode.Resource) error {
	var filePaths []string
	resourceName := strcase.ToKebab(resource.Name)

	// copy controller files to generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + ControllerFile
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+ControllerFile)
	if err != nil {
		log.Debugf("error copying controller file: %v", err)
		return err
	}
	filePaths = append(filePaths, targetResourceControllerFileName)

	// copy model files to generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + ModelFile
	_, err0 := utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+ModelFile)
	if err0 != nil {
		log.Debugf("error copying model file: %v", err0)
		return err0
	}
	filePaths = append(filePaths, targetResourceModelFileName)

	// copy service files to generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + ServiceFile
	_, err1 := utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+ServiceFile)
	if err1 != nil {
		log.Debugf("error copying service file: %v", err1)
		return err1
	}
	filePaths = append(filePaths, targetResourceServiceFileName)

	// copy dao files to generated project
	// add database config here
	filePaths, err2 := c.copySQLDBResourceFiles(resourceName, filePaths)
	if err2 != nil {
		log.Debugf("error copying sql db resources: %v", err2)
		return err2
	}

	// add api.proto file for the resource.
	targetResourceAPIFileName := c.NodeDirectoryName + APIPath + "/" + resourceName + "-" + APIProtoFile
	_, err2 = utils.CopyFile(targetResourceAPIFileName, c.TemplatesRootPath+APIPath+"/"+APIProtoFile)
	if err2 != nil {
		log.Debugf("error copying api.proto file: %v", err2)
		return err2
	}

	filePaths = append(filePaths, targetResourceAPIFileName)

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

func (c *Copier) copySQLDBResourceFiles(resourceName string, filePaths []string) ([]string, error) {
	var targetResourceDaoFileName string
	if c.IsSQLDB {
		if c.SQLDB == Sqlite {
			// dao files
			targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + SqliteDaoFile
			_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+SqliteDaoFile)
			if err != nil {
				log.Debugf("error copying sqlite dao file: %v", err)
				return nil, err
			}
			filePaths = append(filePaths, targetResourceDaoFileName)
		} else if c.SQLDB == MySQL {
			// dao files
			targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + MySQLDaoFile
			_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MySQLDaoFile)
			if err != nil {
				log.Debugf("error copying mysql dao file: %v", err)
				return nil, err
			}
			filePaths = append(filePaths, targetResourceDaoFileName)
		}
	} else {
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+DaoFile)
		if err != nil {
			log.Debugf("error copying dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, targetResourceDaoFileName)
	}
	return filePaths, nil
}

func (c *Copier) getFuncMap(resource *corenode.Resource) template.FuncMap {
	funcMap := template.FuncMap{
		// this function increments message fields number (grpc message)
		"incCount": func(count int) int {
			return count + 2
		},
		// this function lowercase's the first letter of the string in camel case style
		"ToLowerCamelCase": func(key string) string {
			return strcase.ToLowerCamel(key)
		},
		// this function adds pointer to the type if the field is composite
		"AddPointerIfCompositeField": func(key string) string {
			fieldMetaData, ok := resource.Fields[key]
			if ok && fieldMetaData.IsComposite {
				return "*" + fieldMetaData.Type
			}
			return fieldMetaData.Type
		},
		// this function returns the composite fields of the resource
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

// CopyGrpcClientResourceFiles copies grpc client files from template and renames them as per client config.
func (c *Copier) CopyGrpcClientResourceFiles(grpcClient *corenode.GrpcClient) error {
	/// add resource specific data to map in c needed for templates.
	// TODO grpcClient needs too many changes (like referring the .proto and generated files) we can better just have a client created for local grpcServer)
	c.Data["GrpcClientPort"] = grpcClient.Port
	c.Data["GrpcClientServiceName"] = grpcClient.SourceNodeName
	c.Data["GrpcClientSourceNodeID"] = strings.Replace(cases.Title(language.Und, cases.NoLower).String(grpcClient.SourceNodeID), "-", "_", -1)
	// copy grpcClient files to generated project.
	targetResourceClientFileName := c.NodeDirectoryName + GrpcClientPath + "/" + grpcClient.SourceNodeName + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+GrpcClientPath+"/"+ClientFile)
	if err != nil {
		log.Debugf("error copying grpc client file: %v", err)
		return err
	}
	var filePaths []string
	filePaths = append(filePaths, targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}

func (c *Copier) addResourceSpecificTemplateData(resource *corenode.Resource) error {
	// make every field public by making its first character capital.
	fields := map[string]string{}
	protoFields := map[string]string{}
	// this slice is needed for grpc resource message generation
	var fieldNames []string
	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		fields[key] = commonUtils.GetFieldsDataTypeForProtobuf(value.Type)
		protoFields[key] = commonUtils.GetProtoBufDataType(value.Type)
		fieldNames = append(fieldNames, key)
	}
	c.Data["Fields"] = fields
	c.Data["ProtoFields"] = protoFields
	c.Data["FieldNames"] = fieldNames

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

func (c *Copier) addSQLDetails(resource *corenode.Resource) error {
	var createQueryColumns *string
	var insertQueryColumns *string
	var insertQueryParams *string
	var insertQueryExecColumns *string
	var updateQueryColumnsAndParams *string
	var updateQueryExecColumns *string
	var getQueryScanColumns *string

	for key, value := range resource.Fields {
		key = cases.Title(language.Und, cases.NoLower).String(key)
		dbDataType, err := c.getDBDataType(value.Type)
		if err != nil {
			log.Debugf("error while getting db data type for %s", value.Type)
			return err
		}
		createQueryColumns = c.getCreateQueryColumns(key, value, dbDataType)
		insertQueryColumns, insertQueryParams, insertQueryExecColumns = c.getQueryParamsNColumnsNExecColumns(key, value)
		updateQueryColumnsAndParams, updateQueryExecColumns = c.getUpdateQueryColumnsAndParamsNExecColumns(key, value)
		getQueryScanColumns = c.getGetQueryScanColumns(key, value)
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

func (c *Copier) getUpdateQueryColumnsAndParamsNExecColumns(key string, value corenode.FieldMetadata) (*string, *string) {
	var updateQueryColumnsAndParams, updateQueryExecColumns *string
	if len(*updateQueryColumnsAndParams) > 0 {
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

func (c *Copier) getQueryParamsNColumnsNExecColumns(key string, value corenode.FieldMetadata) (*string, *string, *string) {
	var insertQueryParams, insertQueryColumns, insertQueryExecColumns *string
	if len(*insertQueryColumns) > 0 {
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

func (c *Copier) getCreateQueryColumns(key string, value corenode.FieldMetadata, dbDataType string) *string {
	var createQueryColumns *string
	if len(*createQueryColumns) > 0 {
		if value.IsComposite {
			*createQueryColumns += "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NULL,"
		} else {
			*createQueryColumns += "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NOT NULL,"
		}
	} else {
		if value.IsComposite {
			*createQueryColumns = "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NULL,"
		} else {
			*createQueryColumns = "\n\t\t" + cases.Title(language.Und, cases.NoLower).String(key) + " " + dbDataType + " NOT NULL,"
		}
	}
	return createQueryColumns
}

// CreateGrpcConfigs creates/copies relevant files to generated project
func (c *Copier) CreateGrpcConfigs() error {
	if err := c.CreateGrpcServer(); err != nil {
		return err
	}
	if err := c.CreateGrpcClients(); err != nil {
		return err
	}
	return nil
}

// CreateGrpcServer creates/copies relevant files to generated project
func (c *Copier) CreateGrpcServer() error {
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
func (c *Copier) CreateGrpcClients() error {
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

func (c *Copier) getDBDataType(value string) (string, error) {
	if c.SQLDB == Sqlite {
		return commonUtils.GetSqliteDataType(value), nil
	} else if c.SQLDB == MySQL {
		return commonUtils.GetMySQLDataType(value), nil
	}
	return "", errors.New("database not supported")
}

func (c *Copier) copySelfGrpcClientResourceFiles() error {
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

func (c *Copier) getGetQueryScanColumns(key string, value corenode.FieldMetadata) *string {
	var getQueryScanColumns *string
	if len(*getQueryScanColumns) > 0 {
		if value.IsComposite {
			// m here is a model's variable
			*getQueryScanColumns += ", &m." + cases.Title(language.Und, cases.NoLower).String(key) + ".Id"
		} else {
			// m here is a model's variable
			*getQueryScanColumns += ", &m." + cases.Title(language.Und, cases.NoLower).String(key)
		}
	} else {
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
