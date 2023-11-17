package gogrpcserver

import (
	"errors"
	"fmt"
	"github.com/gertd/go-pluralize"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/internal/core/node"
	"github.com/intelops/compage/internal/languages/executor"
	"github.com/intelops/compage/internal/languages/golang/frameworks"
	commonUtils "github.com/intelops/compage/internal/languages/utils"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
	"strings"
	"text/template"
)

const APIPath = "/api/v1"

const ConfigPath = "/config"
const GrpcServerPath = "/pkg/grpc/server"
const GrpcClientPath = "/pkg/grpc/client"

const ControllersPath = GrpcServerPath + "/controllers"
const ServicesPath = GrpcServerPath + "/services"
const DaosPath = GrpcServerPath + "/daos"
const ModelsPath = GrpcServerPath + "/models"

const NoSQLDBClientsPath = DaosPath + "/clients/nosqls"
const NoSQLControllerFile = "nosqls-controller.go.tmpl"
const NoSQLServiceFile = "nosqls-service.go.tmpl"
const NoSQLModelFile = "nosqls-model.go.tmpl"
const NoSQLAPIProtoFile = "nosqls-api.proto.tmpl"
const MongoDBDaoFile = "mongodb-dao.go.tmpl"
const MongoDBConfigFile = "mongodb.go.tmpl"

const SQLDBClientsPath = DaosPath + "/clients/sqls"
const SQLControllerFile = "sqls-controller.go.tmpl"
const SQLServiceFile = "sqls-service.go.tmpl"
const SQLModelFile = "sqls-model.go.tmpl"
const SQLAPIProtoFile = "sqls-api.proto.tmpl"
const DaoFile = "dao.go.tmpl"
const MySQLDaoFile = "mysql-dao.go.tmpl"
const SqliteDaoFile = "sqlite-dao.go.tmpl"
const MySQLDBConfigFile = "mysql.go.tmpl"
const SqliteDBConfigFile = "sqlite.go.tmpl"

// SQLGORMModelFile GORM integration
const SQLGORMModelFile = "sqls-gorm-model.go.tmpl"
const MySQLGORMDaoFile = "mysql-gorm-dao.go.tmpl"
const SQLiteGORMDaoFile = "sqlite-gorm-dao.go.tmpl"
const MySQLGORMDBConfigFile = "mysql-gorm.go.tmpl"
const SQLiteGORMDBConfigFile = "sqlite-gorm.go.tmpl"
const MapDBConfigFile = "map.go.tmpl"

const ClientFile = "client.go.tmpl"
const ConfigFile = "grpc-opentel-config.go.tmpl"

// MongoDB nosql databases
const MongoDB = "MongoDB"

// SQLite sql databases
const SQLite = "SQLite"
const MySQL = "MySQL"
const Map = "Map"

// SQLiteGORM - GORM sql databases
const SQLiteGORM = "SQLite-GORM"
const MySQLGORM = "MySQL-GORM"

// Copier Language specific *Copier
type Copier struct {
	NodeDirectoryName  string
	TemplatesRootPath  string
	Data               map[string]interface{}
	IsGrpcServer       bool
	HasGrpcClients     bool
	SQLDB              string
	NoSQLDB            string
	IsNoSQLDB          bool
	IsSQLDB            bool
	GrpcServerPort     string
	GRPCAllowedMethods []*string
	Resources          []*corenode.Resource
	ResourceConfig     map[string]frameworks.GrpcResourceData
	GrpcClients        []*corenode.GrpcClient
	PluralizeClient    *pluralize.Client
}

func NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isGrpcServer bool, grpcServerPort string, isSQLDB bool, sqlDB string, isNoSQLDB bool, noSQLDB string, resources []*corenode.Resource, grpcClients []*corenode.GrpcClient) *Copier {
	var grpcResourceConfig = make(map[string]frameworks.GrpcResourceData)
	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"GitPlatformUserName": gitPlatformUserName,
		"GitPlatformURL":      strings.Replace(gitPlatformURL, "https://", "", -1),
	}
	data["SQLDB"] = sqlDB
	data["IsSQLDB"] = isSQLDB
	data["NoSQLDB"] = noSQLDB
	data["IsNoSQLDB"] = isNoSQLDB

	// set all resources for main.go.tmpl
	if isGrpcServer {
		var grpcResourceData []frameworks.GrpcResourceData
		for _, r := range resources {
			lowerCamelResourceName := strcase.ToLowerCamel(r.Name)
			resourceData := frameworks.GrpcResourceData{
				SmallKebabCaseResourceNameSingular: strcase.ToKebab(r.Name),
				SmallSnakeCaseResourceNameSingular: strcase.ToSnake(r.Name),
				SmallResourceNameSingular:          lowerCamelResourceName,
				SmallResourceNamePlural:            pluralizeClient.Plural(lowerCamelResourceName),
				CapsResourceNameSingular:           r.Name,
				CapsResourceNamePlural:             pluralizeClient.Plural(r.Name),
			}
			frameworks.AddGRPCAllowedMethods(&resourceData, r.AllowedMethods)
			grpcResourceConfig[r.Name] = resourceData
			grpcResourceData = append(grpcResourceData, resourceData)
		}
		data["GrpcResources"] = grpcResourceData
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
		GrpcServerPort:    grpcServerPort,
		HasGrpcClients:    hasGrpcClients,
		SQLDB:             sqlDB,
		IsSQLDB:           isSQLDB,
		NoSQLDB:           noSQLDB,
		IsNoSQLDB:         isNoSQLDB,
		Resources:         resources,
		ResourceConfig:    grpcResourceConfig,
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
	configDirectory := c.NodeDirectoryName + ConfigPath
	apiDirectory := c.NodeDirectoryName + APIPath
	controllersDirectory := c.NodeDirectoryName + ControllersPath
	modelsDirectory := c.NodeDirectoryName + ModelsPath
	servicesDirectory := c.NodeDirectoryName + ServicesPath
	daosDirectory := c.NodeDirectoryName + DaosPath
	if err := utils.CreateDirectories(configDirectory); err != nil {
		log.Debugf("error creating config directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(apiDirectory); err != nil {
		log.Debugf("error creating api directory: %v", err)
		return err
	}
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
	if c.IsSQLDB {
		// create directories for every resource's db client.
		sqlDBClientsDirectory := c.NodeDirectoryName + SQLDBClientsPath
		if err := utils.CreateDirectories(sqlDBClientsDirectory); err != nil {
			log.Debugf("error creating sql db clients directory: %v", err)
			return err
		}
	} else if c.IsNoSQLDB {
		// create directories for every resource's db client.
		noSQLDBClientsDirectory := c.NodeDirectoryName + NoSQLDBClientsPath
		if err := utils.CreateDirectories(noSQLDBClientsDirectory); err != nil {
			log.Debugf("error creating nosql db clients directory: %v", err)
			return err
		}
	}

	return nil
}

// copyGrpcServerResourceFiles copies grpc server resource files from template and renames them as per resource config.
func (c *Copier) copyGrpcServerResourceFiles(resource *corenode.Resource) error {
	var filePaths []*string
	var err error
	resourceName := strcase.ToKebab(resource.Name)

	if c.IsSQLDB {
		// copy sql controller/service/dao/models files to generated project
		filePaths, err = c.copySQLDBResourceFiles(resourceName, filePaths)
		if err != nil {
			log.Debugf("error copying sql db resources: %v", err)
			return err
		}
	} else if c.IsNoSQLDB {
		// copy nosql controller/service/dao/models to generated project
		filePaths, err = c.copyNoSQLDBResourceFiles(resourceName, filePaths)
		if err != nil {
			log.Debugf("error copying sql db resources: %v", err)
			return err
		}
	}

	// add resource-specific data to map in c needed for templates.
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

func (c *Copier) copyNoSQLDBResourceFiles(resourceName string, filePaths []*string) ([]*string, error) {
	// copy controller files to a generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + strings.Replace(NoSQLControllerFile, "nosqls-", "", 1)
	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+NoSQLControllerFile)
	if err != nil {
		log.Debugf("error copying controller file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceControllerFileName)

	// copy model files to a generated project
	targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(NoSQLModelFile, "nosqls-", "", 1)
	_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+NoSQLModelFile)
	if err != nil {
		log.Debugf("error copying model file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceModelFileName)

	// copy service files to a generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + strings.Replace(NoSQLServiceFile, "nosqls-", "", 1)
	_, err = utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+NoSQLServiceFile)
	if err != nil {
		log.Debugf("error copying service file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceServiceFileName)

	// add api.proto file for the resource.
	targetResourceAPIFileName := c.NodeDirectoryName + APIPath + "/" + resourceName + "-" + strings.Replace(NoSQLAPIProtoFile, "nosqls-", "", 1)
	_, err = utils.CopyFile(targetResourceAPIFileName, c.TemplatesRootPath+APIPath+"/"+NoSQLAPIProtoFile)
	if err != nil {
		log.Debugf("error copying api.proto file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceAPIFileName)

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
	// copy controller files to a generated project
	targetResourceControllerFileName := c.NodeDirectoryName + ControllersPath + "/" + resourceName + "-" + strings.Replace(SQLControllerFile, "sqls-", "", 1)

	_, err := utils.CopyFile(targetResourceControllerFileName, c.TemplatesRootPath+ControllersPath+"/"+SQLControllerFile)
	if err != nil {
		log.Debugf("error copying controller file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceControllerFileName)

	// copy service files to a generated project
	targetResourceServiceFileName := c.NodeDirectoryName + ServicesPath + "/" + resourceName + "-" + strings.Replace(SQLServiceFile, "sqls-", "", 1)
	_, err = utils.CopyFile(targetResourceServiceFileName, c.TemplatesRootPath+ServicesPath+"/"+SQLServiceFile)
	if err != nil {
		log.Debugf("error copying service file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceServiceFileName)

	// add api.proto file for the resource.
	targetResourceAPIFileName := c.NodeDirectoryName + APIPath + "/" + resourceName + "-" + strings.Replace(SQLAPIProtoFile, "sqls-", "", 1)
	_, err = utils.CopyFile(targetResourceAPIFileName, c.TemplatesRootPath+APIPath+"/"+SQLAPIProtoFile)
	if err != nil {
		log.Debugf("error copying api.proto file: %v", err)
		return nil, err
	}
	filePaths = append(filePaths, &targetResourceAPIFileName)

	var targetResourceDaoFileName string
	if c.SQLDB == SQLite {
		// model files
		targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLModelFile, "sqls-", "", 1)

		_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLModelFile)
		if err != nil {
			log.Debugf("error copying model file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceModelFileName)

		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + SqliteDaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+SqliteDaoFile)
		if err != nil {
			log.Debugf("error copying sqlite dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == MySQL {
		// model files
		targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLModelFile, "sqls-", "", 1)

		_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLModelFile)
		if err != nil {
			log.Debugf("error copying model file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceModelFileName)

		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + MySQLDaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MySQLDaoFile)
		if err != nil {
			log.Debugf("error copying mysql dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == Map {
		// model files
		// copy model files to a generated project
		targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLModelFile, "sqls-", "", 1)
		_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLModelFile)
		if err != nil {
			log.Debugf("error copying model file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceModelFileName)
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + DaoFile
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+DaoFile)
		if err != nil {
			log.Debugf("error copying dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == SQLiteGORM {
		// model files
		targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLGORMModelFile, "sqls-gorm-", "", 1)
		_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLGORMModelFile)
		if err != nil {
			log.Debugf("error copying model file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceModelFileName)

		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + strings.Replace(SQLiteGORMDaoFile, "sqlite-gorm-", "", 1)
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+SQLiteGORMDaoFile)
		if err != nil {
			log.Debugf("error copying sqlite gorm dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
	} else if c.SQLDB == MySQLGORM {
		// model files
		targetResourceModelFileName := c.NodeDirectoryName + ModelsPath + "/" + resourceName + "-" + strings.Replace(SQLGORMModelFile, "sqls-gorm-", "", 1)
		_, err = utils.CopyFile(targetResourceModelFileName, c.TemplatesRootPath+ModelsPath+"/"+SQLGORMModelFile)
		if err != nil {
			log.Debugf("error copying model file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceModelFileName)

		// dao files
		targetResourceDaoFileName = c.NodeDirectoryName + DaosPath + "/" + resourceName + "-" + strings.Replace(MySQLGORMDaoFile, "mysql-gorm-", "", 1)
		_, err := utils.CopyFile(targetResourceDaoFileName, c.TemplatesRootPath+DaosPath+"/"+MySQLGORMDaoFile)
		if err != nil {
			log.Debugf("error copying mysql gorm dao file: %v", err)
			return nil, err
		}
		filePaths = append(filePaths, &targetResourceDaoFileName)
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
		// this function adds a pointer to the type if the field is composite
		"AddPointerIfCompositeField": func(key string) string {
			fieldMetaData, ok := resource.Fields[key]
			if ok && fieldMetaData.IsComposite {
				return "*" + fieldMetaData.Type
			}
			return fieldMetaData.Type
		},
		// This function helps the template to add a foreignKey based on composite field
		"AddForeignKeyIfCompositeField": func(key, value string) string {
			if fieldMetaData, ok := resource.Fields[key]; ok && fieldMetaData.IsComposite {
				return fmt.Sprintf("%s %s `gorm:\"foreignKey:ID\" json:\"%s,omitempty\"`", key, value, strcase.ToLowerCamel(key))
			}
			return fmt.Sprintf("%s %s `json:\"%s,omitempty\"`", key, value, strcase.ToLowerCamel(key))
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
	// copy grpcClient files to a generated project.
	targetResourceClientFileName := c.NodeDirectoryName + GrpcClientPath + "/" + grpcClient.SourceNodeName + "-" + ClientFile
	_, err := utils.CopyFile(targetResourceClientFileName, c.TemplatesRootPath+GrpcClientPath+"/"+ClientFile)
	if err != nil {
		log.Debugf("error copying grpc client file: %v", err)
		return err
	}
	var filePaths []*string
	filePaths = append(filePaths, &targetResourceClientFileName)

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
		fields[key] = commonUtils.GetFieldsDataTypeForProtobuf(value.Type)
		protoFields[key] = commonUtils.GetProtoBufDataType(value.Type)
		fieldNames = append(fieldNames, key)
	}
	c.Data["Fields"] = fields
	c.Data["ProtoFields"] = protoFields
	c.Data["FieldNames"] = fieldNames

	// db fields
	if c.IsSQLDB {
		if c.SQLDB == SQLite || c.SQLDB == MySQL {
			err := c.addSQLDetails(resource)
			if err != nil {
				log.Debug("error while adding sql details to resource specific template data", err)
				return err
			}
		}
	}

	// Add another map with the below keys at root level (this is for specific resource for this iteration)
	grpcResourceData := c.ResourceConfig[resource.Name]
	c.Data["SmallKebabCaseResourceNameSingular"] = grpcResourceData.SmallKebabCaseResourceNameSingular
	c.Data["SmallSnakeCaseResourceNameSingular"] = grpcResourceData.SmallSnakeCaseResourceNameSingular
	c.Data["SmallResourceNameSingular"] = grpcResourceData.SmallResourceNameSingular
	c.Data["SmallResourceNamePlural"] = grpcResourceData.SmallResourceNamePlural
	c.Data["CapsResourceNameSingular"] = grpcResourceData.CapsResourceNameSingular
	c.Data["CapsResourceNamePlural"] = grpcResourceData.CapsResourceNamePlural
	c.Data["IsGRPCCreateAllowed"] = grpcResourceData.IsGRPCCreateAllowed
	c.Data["IsGRPCListAllowed"] = grpcResourceData.IsGRPCListAllowed
	c.Data["IsGRPCGetAllowed"] = grpcResourceData.IsGRPCGetAllowed
	c.Data["IsGRPCPutAllowed"] = grpcResourceData.IsGRPCPutAllowed
	c.Data["IsGRPCDeleteAllowed"] = grpcResourceData.IsGRPCDeleteAllowed
	c.Data["IsGRPCPatchAllowed"] = grpcResourceData.IsGRPCPatchAllowed
	c.Data["IsGRPCOptionsAllowed"] = grpcResourceData.IsGRPCOptionsAllowed
	c.Data["IsGRPCHeadAllowed"] = grpcResourceData.IsGRPCHeadAllowed

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
		dbDataType, err := c.getDBDataType(value.Type)
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
		insertQueryColumns = new(string)
		insertQueryParams = new(string)
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

// CreateGrpcConfigs creates/copies relevant files to a generated project
func (c *Copier) CreateGrpcConfigs() error {
	if err := c.CreateGrpcServer(); err != nil {
		return err
	}
	if err := c.CreateGrpcClients(); err != nil {
		return err
	}
	return nil
}

// CreateGrpcServer creates/copies relevant files to a generated project
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

		// copy opentel config file
		var filePaths []*string
		// client files
		targetOpenTelConfigFileName := c.NodeDirectoryName + ConfigPath + "/" + ConfigFile
		_, err := utils.CopyFile(targetOpenTelConfigFileName, c.TemplatesRootPath+ConfigPath+"/"+ConfigFile)
		if err != nil {
			log.Debugf("error copying opentel config file: %v", err)
			return err
		}
		filePaths = append(filePaths, &targetOpenTelConfigFileName)
		err = executor.Execute(filePaths, c.Data)
		if err != nil {
			log.Debugf("error executing opentel config file: %v", err)
			return err
		}

		if c.IsSQLDB {
			// create sql db config file (common to all resources for specific database)
			// No vars in config file as of now, but in future they may be there.
			if c.SQLDB == SQLite {
				var filePaths []*string
				// client files
				targetSQLiteConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + SqliteDBConfigFile
				_, err := utils.CopyFile(targetSQLiteConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+SqliteDBConfigFile)
				if err != nil {
					return err
				}
				filePaths = append(filePaths, &targetSQLiteConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else if c.SQLDB == MySQL {
				var filePaths []*string
				// client files
				targetMySQLConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + MySQLDBConfigFile
				_, err := utils.CopyFile(targetMySQLConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+MySQLDBConfigFile)
				if err != nil {
					return err
				}
				filePaths = append(filePaths, &targetMySQLConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else if c.SQLDB == SQLiteGORM {
				var filePaths []*string
				// client files
				targetSQLiteConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + SQLiteGORMDBConfigFile
				_, err := utils.CopyFile(targetSQLiteConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+SQLiteGORMDBConfigFile)
				if err != nil {
					log.Debugf("error copying sqlite gorm config file: %v", err)
					return err
				}
				filePaths = append(filePaths, &targetSQLiteConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else if c.SQLDB == MySQLGORM {
				var filePaths []*string
				// client files
				targetMySQLConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + MySQLGORMDBConfigFile
				_, err := utils.CopyFile(targetMySQLConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+MySQLGORMDBConfigFile)
				if err != nil {
					log.Debugf("error copying mysql gorm config file: %v", err)
					return err
				}
				filePaths = append(filePaths, &targetMySQLConfigFileName)
				return executor.Execute(filePaths, c.Data)
			} else if c.SQLDB == Map {
				var filePaths []*string
				// client files
				targetMapConfigFileName := c.NodeDirectoryName + SQLDBClientsPath + "/" + MapDBConfigFile
				_, err := utils.CopyFile(targetMapConfigFileName, c.TemplatesRootPath+SQLDBClientsPath+"/"+MapDBConfigFile)
				if err != nil {
					log.Debugf("error copying map config file: %v", err)
					return err
				}
				filePaths = append(filePaths, &targetMapConfigFileName)
				return executor.Execute(filePaths, c.Data)
			}
		} else if c.IsNoSQLDB {
			// create nosql db config file (common to all resources for specific database)
			// No vars in config file as of now, but in future they may be there.
			if c.NoSQLDB == MongoDB {
				var filePaths []*string
				// client files
				targetMongoDBConfigFileName := c.NodeDirectoryName + NoSQLDBClientsPath + "/" + MongoDBConfigFile
				_, err := utils.CopyFile(targetMongoDBConfigFileName, c.TemplatesRootPath+NoSQLDBClientsPath+"/"+MongoDBConfigFile)
				if err != nil {
					log.Debugf("error copying mongodb config file: %v", err)
					return err
				}
				filePaths = append(filePaths, &targetMongoDBConfigFileName)
				return executor.Execute(filePaths, c.Data)
			}
		}
	}
	return nil
}

// CreateGrpcClients creates/copies relevant files to a generated project
func (c *Copier) CreateGrpcClients() error {
	// create directories for a client
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
		// create self-client
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
	if c.SQLDB == SQLite {
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
	var filePaths []*string
	filePaths = append(filePaths, &targetResourceClientFileName)

	// apply template
	return executor.Execute(filePaths, c.Data)
}
