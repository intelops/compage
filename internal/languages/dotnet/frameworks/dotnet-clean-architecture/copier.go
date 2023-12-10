package dotnetcleanarchitecture

import (
	"github.com/gertd/go-pluralize"
	"github.com/iancoleman/strcase"
	corenode "github.com/intelops/compage/internal/core/node"
	frameworks "github.com/intelops/compage/internal/languages/dotnet/frameworks"
	"github.com/intelops/compage/internal/languages/executor"
	log "github.com/sirupsen/logrus"

	"strings"

	"github.com/intelops/compage/internal/utils"
)

// TODO REMOVE later
const RestClientPath = "/pkg/rest/client"

const ApplicationPath = "/Application"
const ApplicationCSProjFile = "/Application/Application.csproj.tmpl"

// commands
const ApplicationCommandsPath = "/Application/Commands"
const ApplicationCommandsCreateResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/CreateResourceNameCommand.cs.tmpl"
const ApplicationCommandsDeleteResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/DeleteResourceNameCommand.cs.tmpl"
const ApplicationCommandsUpdateResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/UpdateResourceNameCommand.cs.tmpl"

// exceptions
const ApplicationExceptionsPath = "/Application/Exceptions"
const ApplicationExceptionsResourceNameNotFoundExceptionCSFile = "/Application/Exceptions/ResourceNameNotFoundException.cs.tmpl"

// extensions
const ApplicationExtensionsPath = "/Application/Extensions"
const ApplicationExtensionsServiceRegistrationCSFile = "/Application/Extensions/ServiceRegistration.cs.tmpl"

// handlers
const ApplicationHandlersPath = "/Application/Handlers"
const ApplicationHandlersResourceNameServicePath = "/Application/Handlers/ResourceNameService"
const ApplicationHandlersCreateResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/CreateResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersDeleteResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/DeleteResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersUpdateResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/UpdateResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersGetResourceNameByIDQueryHandlerCSFile = "/Application/Handlers/ResourceNameService/GetResourceNameByIdQueryHandler.cs.tmpl"
const ApplicationHandlersGetAllResourceNameQueryHandlerCSFile = "/Application/Handlers/ResourceNameService/GetAllResourceNameQueryHandler.cs.tmpl"

// mappers
const ApplicationMappersPath = "/Application/Mappers"
const ApplicationMappersMappingProfileCSFile = "/Application/Mappers/MappingProfile.cs.tmpl"

// queries
const ApplicationQueriesPath = "/Application/Queries"
const ApplicationQueriesResourceNameServicePath = "/Application/Queries/ResourceNameService"
const ApplicationQueriesGetAllResourceNamesQueryCSFile = "/Application/Queries/ResourceNameService/GetAllResourceNamesQuery.cs.tmpl"
const ApplicationQueriesGetResourceNameByIDQueryCSFile = "/Application/Queries/ResourceNameService/GetResourceNameByIdQuery.cs.tmpl"

// responses
const ApplicationResponsesPath = "/Application/Responses"
const ApplicationResponsesResourceNameResponseCSFile = "/Application/Responses/ResourceNameResponse.cs.tmpl"

const CorePath = "/Core"
const CoreCoreCSProjFile = "/Core/Core.csproj.tmpl"

// common
const CoreCommonPath = "/Core/Common"
const CoreCommonEntityBaseFile = "/Core/Common/EntityBase.cs.tmpl"

// entities
const CoreEntitiesPath = "/Core/Entities"
const CoreEntitiesResourceNameCSFile = "/Core/Entities/ResourceName.cs.tmpl"

// repositories
const CoreRepositoriesPath = "/Core/Repositories"
const CoreRepositoriesIResourceNameRepositoryCSFile = "/Core/Repositories/IResourceNameRepository.cs.tmpl"
const CoreRepositoriesIAsyncRepositoryCSFile = "/Core/Repositories/IAsyncRepository.cs.tmpl"

const InfrastructurePath = "/Infrastructure"
const InfrastructureCSProjFile = "/Infrastructure/Infrastructure.csproj.tmpl"

// data
const InfrastructureDataPath = "/Infrastructure/Data"
const InfrastructureDataDatabaseContextCSFile = "/Infrastructure/Data/DatabaseContext.cs.tmpl"
const InfrastructureDataDatabaseContextFactoryCSFile = "/Infrastructure/Data/DatabaseContextFactory.cs.tmpl"

// extensions
const InfrastructureExtensionsPath = "/Infrastructure/Extensions"
const InfrastructureExtensionsServicesCollectionExtensionsCSFile = "/Infrastructure/Extensions/ServicesCollectionExtensions.cs.tmpl"

// repositories
const InfrastructureRepositoriesPath = "/Infrastructure/Repositories"
const InfrastructureRepositoriesRepositoryBaseCSFile = "/Infrastructure/Repositories/RepositoryBase.cs.tmpl"
const InfrastructureRepositoriesResourceNameRepositoryCSFile = "/Infrastructure/Repositories/ResourceNameRepository.cs.tmpl"

// microServiceName
const MicroServiceNameCSProjFile = "/MicroServiceName/MicroServiceName.csproj.tmpl"
const MicroServiceNameProgramCSFile = "/MicroServiceName/Program.cs.tmpl"
const MicroServiceNameCSProjUSerFile = "/MicroServiceName/MicroServiceName.csproj.user.tmpl"
const MicroServiceNameAppSettingsDevelopmentFile = "/MicroServiceName/appsettings.Development.json.tmpl"
const MicroServiceNameAppSettingsFile = "/MicroServiceName/appsettings.json.tmpl"

// controllers
const MicroServiceNameControllersPath = "/Controllers"
const MicroServiceNameControllersResourceNameServiceControllerCSFile = "/MicroServiceName/Controllers/ResourceNameServiceController.cs.tmpl"

// properties
const MicroServiceNamePropertiesPath = "/Properties"
const MicroServiceNamePropertiesLaunchSettingsJSONFile = "/MicroServiceName/Properties/launchSettings.json.tmpl"

const TestsPath = "/Tests"
const TestsApplicationTestsCSProjFile = "/Tests/Application.Tests/Application.Tests.csproj.tmpl"
const TestsGlobalUsingsCSFile = "/Tests/Application.Tests/GlobalUsings.cs.tmpl"

// handlers
const TestsHandlersPath = "/Tests/Application.Tests/Handlers"
const TestsHandlersResourceNameServicePath = "/Tests/Application.Tests/Handlers/ResourceNameService"
const TestsHandlersCreateResourceNameCommandHandlerTestsCSFile = "/Tests/Application.Tests/Handlers/ResourceNameService/CreateResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersDeleteResourceNameCommandHandlerTestsCSFile = "/Tests/Application.Tests/Handlers/ResourceNameService/DeleteResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersUpdateResourceNameCommandHandlerTestsCSFile = "/Tests/Application.Tests/Handlers/ResourceNameService/UpdateResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersTestsHandlersGetResourceNameByIDQueryHandlerTestsCSFile = "/Tests/Application.Tests/Handlers/ResourceNameService/GetResourceNameByIdQueryHandlerTests.cs.tmpl"
const TestsHandlersGetAllResourceNamesQueryHandlerTestsCSFile = "/Tests/Application.Tests/Handlers/ResourceNameService/GetAllResourceNamesQueryHandlerTests.cs.tmpl"

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
	ResourceConfig    map[string]*frameworks.RestResourceData
	RestClients       []*corenode.RestClient
	PluralizeClient   *pluralize.Client
}

func NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string, isRestServer bool, restServerPort string, isSQLDB bool, sqlDB string, isNoSQLDB bool, noSQLDB string, resources []*corenode.Resource, restClients []*corenode.RestClient) *Copier {
	var restResourceConfig = make(map[string]*frameworks.RestResourceData)
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

	if isRestServer {
		var restResourceData []*frameworks.RestResourceData
		for _, r := range resources {
			lowerCamelResourceName := strcase.ToLowerCamel(r.Name)
			resourceData := frameworks.RestResourceData{
				SmallKebabCaseResourceNameSingular: strcase.ToKebab(r.Name),
				SmallSnakeCaseResourceNameSingular: strcase.ToSnake(r.Name),
				SmallResourceNameSingular:          lowerCamelResourceName,
				SmallResourceNamePlural:            pluralizeClient.Plural(lowerCamelResourceName),
				CapsResourceNameSingular:           r.Name,
				CapsResourceNamePlural:             pluralizeClient.Plural(r.Name),
			}
			frameworks.AddRESTAllowedMethods(&resourceData, r.AllowedMethods)
			restResourceConfig[r.Name] = &resourceData
			restResourceData = append(restResourceData, &resourceData)
		}
		data["RestResources"] = restResourceData
		data["RestServerPort"] = restServerPort
		data["IsRestServer"] = isRestServer
	}

	hasRestClients := len(restClients) > 0

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		IsRestServer:      isRestServer,
		RestServerPort:    restServerPort,
		HasRestClients:    hasRestClients,
		SQLDB:             sqlDB,
		IsSQLDB:           isSQLDB,
		NoSQLDB:           noSQLDB,
		IsNoSQLDB:         isNoSQLDB,
		Resources:         resources,
		ResourceConfig:    restResourceConfig,
		RestClients:       restClients,
		PluralizeClient:   pluralizeClient,
	}
}

func getMicroServiceName(name string) string {
	splitted := strings.Split(name, "/")
	return splitted[len(splitted)-1]
}

// createRestServerDirectories creates rest server directories.
func (c *Copier) createRestServerDirectories() error {
	applicationDirectory := c.NodeDirectoryName + ApplicationPath
	applicationCommandsDirectory := c.NodeDirectoryName + ApplicationCommandsPath
	applicationExceptionsDirectory := c.NodeDirectoryName + ApplicationExceptionsPath
	applicationExtensionsDirectory := c.NodeDirectoryName + ApplicationExtensionsPath
	applicationHandlersDirectory := c.NodeDirectoryName + ApplicationHandlersPath
	applicationMappersDirectory := c.NodeDirectoryName + ApplicationMappersPath
	applicationQueriesDirectory := c.NodeDirectoryName + ApplicationQueriesPath
	applicationResponsesDirectory := c.NodeDirectoryName + ApplicationResponsesPath

	if err := utils.CreateDirectories(applicationDirectory); err != nil {
		log.Errorf("error creating application directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationCommandsDirectory); err != nil {
		log.Errorf("error creating application commands directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationExceptionsDirectory); err != nil {
		log.Errorf("error creating application exceptions directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationExtensionsDirectory); err != nil {
		log.Errorf("error creating application extensions directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationHandlersDirectory); err != nil {
		log.Errorf("error creating application handlers directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationMappersDirectory); err != nil {
		log.Errorf("error creating application mappers directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationQueriesDirectory); err != nil {
		log.Errorf("error creating application queries directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(applicationResponsesDirectory); err != nil {
		log.Errorf("error creating application responses directory: %v", err)
		return err
	}

	coreDirectory := c.NodeDirectoryName + CorePath
	coreCommonDirectory := c.NodeDirectoryName + CoreCommonPath
	coreEntitiesDirectory := c.NodeDirectoryName + CoreEntitiesPath
	coreRepositoriesDirectory := c.NodeDirectoryName + CoreRepositoriesPath
	if err := utils.CreateDirectories(coreDirectory); err != nil {
		log.Errorf("error creating core directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(coreCommonDirectory); err != nil {
		log.Errorf("error creating core common directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(coreEntitiesDirectory); err != nil {
		log.Errorf("error creating core entities directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(coreRepositoriesDirectory); err != nil {
		log.Errorf("error creating core repositories directory: %v", err)
		return err
	}

	infrastructureDirectory := c.NodeDirectoryName + InfrastructurePath
	infrastructureDataDirectory := c.NodeDirectoryName + InfrastructureDataPath
	infrastructureExtensionsDirectory := c.NodeDirectoryName + InfrastructureExtensionsPath
	infrastructureRepositoriesDirectory := c.NodeDirectoryName + InfrastructureRepositoriesPath
	if err := utils.CreateDirectories(infrastructureDirectory); err != nil {
		log.Errorf("error creating infrastructure directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(infrastructureDataDirectory); err != nil {
		log.Errorf("error creating infrastructure data directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(infrastructureExtensionsDirectory); err != nil {
		log.Errorf("error creating infrastructure extensions directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(infrastructureRepositoriesDirectory); err != nil {
		log.Errorf("error creating infrastructure repositories directory: %v", err)
		return err
	}

	microServiceNameDirectory := c.NodeDirectoryName + "/" + getMicroServiceName(c.NodeDirectoryName)
	microServiceNameControllersDirectory := microServiceNameDirectory + MicroServiceNameControllersPath
	microServiceNamePropertiesDirectory := microServiceNameDirectory + MicroServiceNamePropertiesPath
	if err := utils.CreateDirectories(microServiceNameDirectory); err != nil {
		log.Errorf("error creating project name directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(microServiceNameControllersDirectory); err != nil {
		log.Errorf("error creating project name controllers directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(microServiceNamePropertiesDirectory); err != nil {
		log.Errorf("error creating project name properties directory: %v", err)
		return err
	}

	testsDirectory := c.NodeDirectoryName + TestsPath
	testsHandlersDirectory := c.NodeDirectoryName + TestsHandlersPath
	if err := utils.CreateDirectories(testsDirectory); err != nil {
		log.Errorf("error creating tests directory: %v", err)
		return err
	}
	if err := utils.CreateDirectories(testsHandlersDirectory); err != nil {
		log.Errorf("error creating tests handlers directory: %v", err)
		return err
	}

	return nil
}

// copyRestServerResourceFiles copies rest server resource files from template and renames them as per resource config.
func (c *Copier) copyRestServerResourceFiles(resource *corenode.Resource) error {
	filePaths := &[]*string{}
	var err error
	// copy sql files (core)
	//if c.IsSQLDB {
	//	// add files to filePaths and copy them to the generated project
	//}

	// add files for application
	err = c.addApplicationRelatedDirectoriesAndFiles(resource, filePaths)
	if err != nil {
		log.Errorf("error adding application related directories and files: %v", err)
		return err
	}

	// add files for core
	err = c.addCoreRelatedDirectoriesAndFiles(resource, filePaths)
	if err != nil {
		log.Errorf("error adding core related directories and files: %v", err)
		return err
	}

	// add files for infrastructure
	err = c.addInfrastructureRelatedDirectoriesAndFiles(resource, filePaths)
	if err != nil {
		log.Errorf("error adding infrastructure related directories and files: %v", err)
		return err
	}

	// add files for MicroServiceName
	err = c.addMicroServiceNameRelatedDirectoriesAndFiles(resource, filePaths)
	if err != nil {
		log.Errorf("error adding MicroServiceName related directories and files: %v", err)
		return err
	}

	// add resource-specific data to map in c needed for templates.
	err = c.addResourceSpecificTemplateData(resource)
	if err != nil {
		log.Errorf("error adding resource specific template data: %v", err)
		return err
	}

	// apply template
	return executor.Execute(*filePaths, c.Data)
}

func (c *Copier) addApplicationRelatedDirectoriesAndFiles(resource *corenode.Resource, filePaths *[]*string) error {
	var err error
	// create directories for resource commands
	resourceCommandsDirectory := c.NodeDirectoryName + ApplicationCommandsPath + "/" + resource.Name + "Service"
	if err = utils.CreateDirectories(resourceCommandsDirectory); err != nil {
		log.Errorf("error creating resource commands directory: %v", err)
		return err
	}

	// copy application/commands/ResourceNameService/CreateResourceNameCommand.cs
	targetApplicationCommandsCreateResourceNameCommandFileName := c.NodeDirectoryName + ApplicationCommandsPath + "/" + resource.Name + "Service" + "/" + "Create" + resource.Name + "Command.cs"
	_, err = utils.CopyFile(targetApplicationCommandsCreateResourceNameCommandFileName, c.TemplatesRootPath+ApplicationCommandsCreateResourceNameCommandCSFile)
	if err != nil {
		log.Errorf("error copying application commands CreateResourceNameCommand.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationCommandsCreateResourceNameCommandFileName)

	// copy application/commands/ResourceNameService/DeleteResourceNameCommand.cs
	targetApplicationCommandsDeleteResourceNameCommandFileName := c.NodeDirectoryName + ApplicationCommandsPath + "/" + resource.Name + "Service" + "/" + "Delete" + resource.Name + "Command.cs"
	_, err = utils.CopyFile(targetApplicationCommandsDeleteResourceNameCommandFileName, c.TemplatesRootPath+ApplicationCommandsDeleteResourceNameCommandCSFile)
	if err != nil {
		log.Errorf("error copying application commands DeleteResourceNameCommand.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationCommandsDeleteResourceNameCommandFileName)

	// copy application/commands/ResourceNameService/UpdateResourceNameCommand.cs
	targetApplicationCommandsUpdateResourceNameCommandFileName := c.NodeDirectoryName + ApplicationCommandsPath + "/" + resource.Name + "Service" + "/" + "Update" + resource.Name + "Command.cs"
	_, err = utils.CopyFile(targetApplicationCommandsUpdateResourceNameCommandFileName, c.TemplatesRootPath+ApplicationCommandsUpdateResourceNameCommandCSFile)
	if err != nil {
		log.Errorf("error copying application commands UpdateResourceNameCommand.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationCommandsUpdateResourceNameCommandFileName)

	// create exceptions files
	// copy application/exceptions/ResourceNameNotFoundException.cs
	targetApplicationExceptionsResourceNameNotFoundExceptionFileName := c.NodeDirectoryName + ApplicationExceptionsPath + "/" + resource.Name + "NotFoundException.cs"
	_, err = utils.CopyFile(targetApplicationExceptionsResourceNameNotFoundExceptionFileName, c.TemplatesRootPath+ApplicationExceptionsResourceNameNotFoundExceptionCSFile)
	if err != nil {
		log.Errorf("error copying application exceptions ResourceNameNotFoundException.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationExceptionsResourceNameNotFoundExceptionFileName)

	// handlers
	// create directories for resource handlers
	resourceHandlersDirectory := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service"
	if err = utils.CreateDirectories(resourceHandlersDirectory); err != nil {
		log.Errorf("error creating resource handlers directory: %v", err)
		return err
	}

	// copy application/handlers/ResourceNameService/CreateResourceNameCommandHandler.cs
	targetApplicationHandlersCreateResourceNameCommandHandlerFileName := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service" + "/" + "Create" + resource.Name + "CommandHandler.cs"
	_, err = utils.CopyFile(targetApplicationHandlersCreateResourceNameCommandHandlerFileName, c.TemplatesRootPath+ApplicationHandlersCreateResourceNameCommandHandlerCSFile)
	if err != nil {
		log.Errorf("error copying application handlers CreateResourceNameCommandHandler.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationHandlersCreateResourceNameCommandHandlerFileName)

	// copy application/handlers/ResourceNameService/GetAllResourceNamesQueryHandler.cs
	targetApplicationHandlersGetAllResourceNameQueryHandlerFileName := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service" + "/" + "GetAll" + resource.Name + "sQueryHandler.cs"
	_, err = utils.CopyFile(targetApplicationHandlersGetAllResourceNameQueryHandlerFileName, c.TemplatesRootPath+ApplicationHandlersGetAllResourceNameQueryHandlerCSFile)
	if err != nil {
		log.Errorf("error copying application handlers GetAllResourceNameQueryHandler.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationHandlersGetAllResourceNameQueryHandlerFileName)

	// copy application/handlers/ResourceNameService/GetResourceNameByIdQueryHandler.cs
	targetApplicationHandlersGetResourceNameHandlerFileName := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service" + "/" + "Get" + resource.Name + "ByIdQueryHandler.cs"
	_, err = utils.CopyFile(targetApplicationHandlersGetResourceNameHandlerFileName, c.TemplatesRootPath+ApplicationHandlersGetResourceNameByIDQueryHandlerCSFile)
	if err != nil {
		log.Errorf("error copying application handlers GetResourceNameByIdQueryHandler.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationHandlersGetResourceNameHandlerFileName)

	// copy application/handlers/ResourceNameService/UpdateResourceNameCommandHandler.cs
	targetApplicationHandlersUpdateResourceNameCommandHandlerFileName := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service" + "/" + "Update" + resource.Name + "CommandHandler.cs"
	_, err = utils.CopyFile(targetApplicationHandlersUpdateResourceNameCommandHandlerFileName, c.TemplatesRootPath+ApplicationHandlersUpdateResourceNameCommandHandlerCSFile)
	if err != nil {
		log.Errorf("error copying application handlers UpdateResourceNameCommandHandler.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationHandlersUpdateResourceNameCommandHandlerFileName)

	// copy application/handlers/ResourceNameService/DeleteResourceNameCommandHandler.cs
	targetApplicationHandlersDeleteResourceNameCommandHandlerFileName := c.NodeDirectoryName + ApplicationHandlersPath + "/" + resource.Name + "Service" + "/" + "Delete" + resource.Name + "CommandHandler.cs"
	_, err = utils.CopyFile(targetApplicationHandlersDeleteResourceNameCommandHandlerFileName, c.TemplatesRootPath+ApplicationHandlersDeleteResourceNameCommandHandlerCSFile)
	if err != nil {
		log.Errorf("error copying application handlers DeleteResourceNameCommandHandler.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationHandlersDeleteResourceNameCommandHandlerFileName)

	// mappers
	// copy application/mappers/MapperProfile.cs
	targetApplicationMappersMappingProfileFileName := c.NodeDirectoryName + ApplicationMappersPath + "/MappingProfile.cs"
	_, err = utils.CopyFile(targetApplicationMappersMappingProfileFileName, c.TemplatesRootPath+ApplicationMappersMappingProfileCSFile)
	if err != nil {
		log.Errorf("error copying application mappers MappingProfile.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationMappersMappingProfileFileName)

	// queries
	// create directories for resource queries
	resourceQueriesDirectory := c.NodeDirectoryName + ApplicationQueriesPath + "/" + resource.Name + "Service"
	if err = utils.CreateDirectories(resourceQueriesDirectory); err != nil {
		log.Errorf("error creating resource queries directory: %v", err)
		return err
	}
	// copy application/queries/GetResourceNameByIdQuery.cs
	targetApplicationQueriesGetResourceNameByIDQueryFileName := c.NodeDirectoryName + ApplicationQueriesPath + "/" + resource.Name + "Service" + "/" + "Get" + resource.Name + "ByIdQuery.cs"
	_, err = utils.CopyFile(targetApplicationQueriesGetResourceNameByIDQueryFileName, c.TemplatesRootPath+ApplicationQueriesGetResourceNameByIDQueryCSFile)
	if err != nil {
		log.Errorf("error copying application queries GetResourceNameByIdQuery.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationQueriesGetResourceNameByIDQueryFileName)

	// copy application/queries/GetAllResourceNamesQuery.cs
	targetApplicationQueriesGetAllResourceNamesQueryFileName := c.NodeDirectoryName + ApplicationQueriesPath + "/" + resource.Name + "Service" + "/" + "GetAll" + resource.Name + "sQuery.cs"
	_, err = utils.CopyFile(targetApplicationQueriesGetAllResourceNamesQueryFileName, c.TemplatesRootPath+ApplicationQueriesGetAllResourceNamesQueryCSFile)
	if err != nil {
		log.Errorf("error copying application queries GetAllResourceNamesQuery.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationQueriesGetAllResourceNamesQueryFileName)

	// responses
	// copy application/responses/ResourceNameResponse.cs
	targetApplicationResponsesResourceNameResponseFileName := c.NodeDirectoryName + ApplicationResponsesPath + "/" + resource.Name + "Response.cs"
	_, err = utils.CopyFile(targetApplicationResponsesResourceNameResponseFileName, c.TemplatesRootPath+ApplicationResponsesResourceNameResponseCSFile)
	if err != nil {
		log.Errorf("error copying application responses ResourceNameResponse.cs file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationResponsesResourceNameResponseFileName)

	return nil
}

func (c *Copier) addCoreRelatedDirectoriesAndFiles(resource *corenode.Resource, filePaths *[]*string) error {
	var err error
	// copy core/entities/ResourceName.cs
	targetCoreEntitiesResourceNameFileName := c.NodeDirectoryName + CoreEntitiesPath + "/" + resource.Name + ".cs"
	_, err = utils.CopyFile(targetCoreEntitiesResourceNameFileName, c.TemplatesRootPath+CoreEntitiesResourceNameCSFile)
	if err != nil {
		log.Errorf("error copying core entities resource name file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetCoreEntitiesResourceNameFileName)

	// copy core/repositories/IResourceNameRepository.cs
	targetCoreRepositoriesIResourceNameRepositoryFileName := c.NodeDirectoryName + CoreRepositoriesPath + "/" + "I" + resource.Name + "Repository.cs"
	_, err = utils.CopyFile(targetCoreRepositoriesIResourceNameRepositoryFileName, c.TemplatesRootPath+CoreRepositoriesIResourceNameRepositoryCSFile)
	if err != nil {
		log.Errorf("error copying core repositories resource name repository file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetCoreRepositoriesIResourceNameRepositoryFileName)

	return nil
}

func (c *Copier) addInfrastructureRelatedDirectoriesAndFiles(resource *corenode.Resource, paths *[]*string) error {
	var err error
	// copy infrastructure/data/DatabaseContext.cs
	targetInfrastructureDataDatabaseContextFileName := c.NodeDirectoryName + InfrastructureDataPath + "/" + "DatabaseContext.cs"
	_, err = utils.CopyFile(targetInfrastructureDataDatabaseContextFileName, c.TemplatesRootPath+InfrastructureDataDatabaseContextCSFile)
	if err != nil {
		log.Errorf("error copying infrastructure data database context file: %v", err)
		return err
	}
	*paths = append(*paths, &targetInfrastructureDataDatabaseContextFileName)

	// copy infrastructure/extensions/ServiceCollectionExtensions.cs
	targetInfrastructureExtensionsServicesCollectionExtensionsFileName := c.NodeDirectoryName + InfrastructureExtensionsPath + "/" + "ServicesCollectionExtensions.cs"
	_, err = utils.CopyFile(targetInfrastructureExtensionsServicesCollectionExtensionsFileName, c.TemplatesRootPath+InfrastructureExtensionsServicesCollectionExtensionsCSFile)
	if err != nil {
		log.Errorf("error copying infrastructure extensions services collection extensions file: %v", err)
		return err
	}
	*paths = append(*paths, &targetInfrastructureExtensionsServicesCollectionExtensionsFileName)

	// copy infrastructure/repositories/ResourcesNameRepository.cs
	targetInfrastructureRepositoriesResourceNameRepositoryFileName := c.NodeDirectoryName + InfrastructureRepositoriesPath + "/" + resource.Name + "Repository.cs"
	_, err = utils.CopyFile(targetInfrastructureRepositoriesResourceNameRepositoryFileName, c.TemplatesRootPath+InfrastructureRepositoriesResourceNameRepositoryCSFile)
	if err != nil {
		log.Errorf("error copying infrastructure repositories resource name repository file: %v", err)
		return err
	}
	*paths = append(*paths, &targetInfrastructureRepositoriesResourceNameRepositoryFileName)

	return nil
}

func (c *Copier) addMicroServiceNameRelatedDirectoriesAndFiles(resource *corenode.Resource, filePaths *[]*string) error {
	var err error
	// copy MicroServiceName/Controllers/ResourceNameServiceController.cs
	targetMicroServiceNameControllersResourceNameServiceControllerFileName := c.NodeDirectoryName + "/" + getMicroServiceName(c.NodeDirectoryName) + MicroServiceNameControllersPath + "/" + resource.Name + "ServiceController.cs"
	_, err = utils.CopyFile(targetMicroServiceNameControllersResourceNameServiceControllerFileName, c.TemplatesRootPath+MicroServiceNameControllersResourceNameServiceControllerCSFile)
	if err != nil {
		log.Errorf("error copying MicroServiceName controllers resource name service controller file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetMicroServiceNameControllersResourceNameServiceControllerFileName)

	// copy MicroServiceName/Properties/launchSettings.json
	targetMicroServiceNamePropertiesLaunchSettingsJSONFileName := c.NodeDirectoryName + "/" + getMicroServiceName(c.NodeDirectoryName) + MicroServiceNamePropertiesPath + "/" + "launchSettings.json"
	_, err = utils.CopyFile(targetMicroServiceNamePropertiesLaunchSettingsJSONFileName, c.TemplatesRootPath+MicroServiceNamePropertiesLaunchSettingsJSONFile)
	if err != nil {
		log.Errorf("error copying MicroServiceName properties launch settings json file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetMicroServiceNamePropertiesLaunchSettingsJSONFileName)

	return nil
}

func (c *Copier) addResourceSpecificTemplateData(resource *corenode.Resource) error {
	// make every field public by making its first character capital.
	fields := map[string]string{}
	for key, value := range resource.Fields {
		fields[key] = value.Type
	}
	c.Data["Fields"] = fields
	// Add another map with the below keys at root level (this is for specific resource for this iteration)
	restResourceData := c.ResourceConfig[resource.Name]
	c.Data["SmallKebabCaseResourceNameSingular"] = restResourceData.SmallKebabCaseResourceNameSingular
	c.Data["SmallSnakeCaseResourceNameSingular"] = restResourceData.SmallSnakeCaseResourceNameSingular
	c.Data["SmallResourceNameSingular"] = restResourceData.SmallResourceNameSingular
	c.Data["SmallResourceNamePlural"] = restResourceData.SmallResourceNamePlural
	c.Data["CapsResourceNameSingular"] = restResourceData.CapsResourceNameSingular
	c.Data["CapsResourceNamePlural"] = restResourceData.CapsResourceNamePlural
	c.Data["IsRESTCreateAllowed"] = restResourceData.IsRESTCreateAllowed
	c.Data["IsRESTListAllowed"] = restResourceData.IsRESTListAllowed
	c.Data["IsRESTGetAllowed"] = restResourceData.IsRESTGetAllowed
	c.Data["IsRESTPutAllowed"] = restResourceData.IsRESTPutAllowed
	c.Data["IsRESTDeleteAllowed"] = restResourceData.IsRESTDeleteAllowed
	c.Data["IsRESTPatchAllowed"] = restResourceData.IsRESTPatchAllowed
	c.Data["IsRESTOptionsAllowed"] = restResourceData.IsRESTPatchAllowed
	c.Data["IsRESTHeadAllowed"] = restResourceData.IsRESTHeadAllowed

	return nil
}

// CreateRestServer creates/copies relevant files to a generated project
func (c *Copier) CreateRestServer() error {
	// if the node is server, add server code
	if c.IsRestServer {
		// create directories for controller, service, dao, models
		if err := c.createRestServerDirectories(); err != nil {
			log.Errorf("error creating rest server directories: %v", err)
			return err
		}

		// copy below files to the generated project
		// application/Application.csproj
		// application/Extensions/ServiceRegistration.cs
		if err := c.copyApplicationFiles(); err != nil {
			log.Errorf("error copying application files: %v", err)
			return err
		}

		// copy below files to the generated project
		// core/common/EntityBase.cs
		// core/Repositories/IAsyncRepository.cs
		// core/Core.csproj
		if err := c.copyCoreFiles(); err != nil {
			log.Errorf("error copying core files: %v", err)
			return err
		}

		// copy below files to the generated project
		// infrastructure/Infrastructure.csproj
		// infrastructure/Data/DatabaseContext.cs
		// infrastructure/Data/DatabaseContextFactory.cs
		if err := c.copyInfrastructureFiles(); err != nil {
			log.Errorf("error copying infrastructure files: %v", err)
			return err
		}

		// copy below files to the generated project
		// tests/Application.Tests.csproj
		// tests/GlobalUsings.cs
		if err := c.copyTestsFiles(); err != nil {
			log.Errorf("error copying tests files: %v", err)
			return err
		}
		// copy files with respect to the names of resources
		for _, resource := range c.Resources {
			if err := c.copyRestServerResourceFiles(resource); err != nil {
				log.Errorf("error copying rest server resource files: %v", err)
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
		log.Errorf("error copying root level files: %v", err)
		return err
	}
	_, files, err0 := utils.GetDirectoriesAndFilePaths(c.NodeDirectoryName)
	if err0 != nil {
		log.Errorf("error getting directories and file paths: %v", err0)
		return err0
	}
	return executor.Execute(files, c.Data)
}

func (c *Copier) copyCoreFiles() error {
	filePaths := &[]*string{}
	// CoreCommonEntityBaseFile
	targetCoreCommonEntityBaseFileName := c.NodeDirectoryName + CoreCommonEntityBaseFile
	_, err := utils.CopyFile(targetCoreCommonEntityBaseFileName, c.TemplatesRootPath+CoreCommonEntityBaseFile)
	if err != nil {
		log.Errorf("error copying Core Common EntityBase file: %v", err)
		return err
	}

	// CoreCoreCSProjFile
	targetCoreCoreCSProjFileName := c.NodeDirectoryName + CoreCoreCSProjFile
	_, err = utils.CopyFile(targetCoreCoreCSProjFileName, c.TemplatesRootPath+CoreCoreCSProjFile)
	if err != nil {
		log.Errorf("error copying Core Core.csproj file: %v", err)
		return err
	}

	// CoreRepositoriesIAsyncRepositoryCSFile
	targetCoreRepositoriesAsyncRepositoryFileName := c.NodeDirectoryName + CoreRepositoriesIAsyncRepositoryCSFile
	_, err = utils.CopyFile(targetCoreRepositoriesAsyncRepositoryFileName, c.TemplatesRootPath+CoreCommonEntityBaseFile)
	if err != nil {
		log.Errorf("error copying Core Repositories IAsyncRepository.cs file: %v", err)
		return err
	}

	*filePaths = append(*filePaths, &targetCoreRepositoriesAsyncRepositoryFileName)

	return executor.Execute(*filePaths, c.Data)
}

func (c *Copier) copyInfrastructureFiles() error {
	filePaths := &[]*string{}
	// infrastructure/Infrastructure.csproj
	targetInfrastructureCSProjFileName := c.NodeDirectoryName + InfrastructureCSProjFile
	_, err := utils.CopyFile(targetInfrastructureCSProjFileName, c.TemplatesRootPath+InfrastructureCSProjFile)
	if err != nil {
		log.Errorf("error copying infrastructure Infrastructure.csproj file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetInfrastructureCSProjFileName)

	// infrastructure/Data/DatabaseContextFactory.cs
	targetDatabaseContextFactoryFileName := c.NodeDirectoryName + InfrastructureDataDatabaseContextFactoryCSFile
	_, err = utils.CopyFile(targetDatabaseContextFactoryFileName, c.TemplatesRootPath+InfrastructureDataDatabaseContextFactoryCSFile)
	if err != nil {
		log.Errorf("error copying infrastructure DatabaseContextFactory file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetDatabaseContextFactoryFileName)

	// infrastructure/Repositories/RepositoryBase.cs
	targetRepositoriesRepositoryBaseFileName := c.NodeDirectoryName + InfrastructureRepositoriesRepositoryBaseCSFile
	_, err = utils.CopyFile(targetRepositoriesRepositoryBaseFileName, c.TemplatesRootPath+InfrastructureRepositoriesRepositoryBaseCSFile)
	if err != nil {
		log.Errorf("error copying infrastructure RepositoryBase file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetRepositoriesRepositoryBaseFileName)

	return executor.Execute(*filePaths, c.Data)
}

func (c *Copier) copyApplicationFiles() error {
	filePaths := &[]*string{}
	// application/Application.csproj
	targetApplicationCSProjFileName := c.NodeDirectoryName + ApplicationCSProjFile
	_, err := utils.CopyFile(targetApplicationCSProjFileName, c.TemplatesRootPath+ApplicationCSProjFile)
	if err != nil {
		log.Errorf("error copying application Application.csproj file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationCSProjFileName)

	// application/Extensions/ServiceRegistration.cs
	targetApplicationExtensionsServiceRegistrationFileName := c.NodeDirectoryName + ApplicationExtensionsServiceRegistrationCSFile
	_, err = utils.CopyFile(targetApplicationExtensionsServiceRegistrationFileName, c.TemplatesRootPath+ApplicationExtensionsServiceRegistrationCSFile)
	if err != nil {
		log.Errorf("error copying application ServiceRegistration file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationExtensionsServiceRegistrationFileName)

	return executor.Execute(*filePaths, c.Data)
}

func (c *Copier) copyTestsFiles() error {
	filePaths := &[]*string{}
	// tests/Application.Tests.csproj
	targetApplicationTestsCSProjFileName := c.NodeDirectoryName + TestsApplicationTestsCSProjFile
	_, err := utils.CopyFile(targetApplicationTestsCSProjFileName, c.TemplatesRootPath+TestsApplicationTestsCSProjFile)
	if err != nil {
		log.Errorf("error copying tests Application.Tests.csproj file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetApplicationTestsCSProjFileName)

	// tests/GlobalUsings.cs
	targetGlobalUsingsFileName := c.NodeDirectoryName + TestsGlobalUsingsCSFile
	_, err = utils.CopyFile(targetGlobalUsingsFileName, c.TemplatesRootPath+TestsGlobalUsingsCSFile)
	if err != nil {
		log.Errorf("error copying tests GlobalUsings file: %v", err)
		return err
	}
	*filePaths = append(*filePaths, &targetGlobalUsingsFileName)

	return executor.Execute(*filePaths, c.Data)
}
