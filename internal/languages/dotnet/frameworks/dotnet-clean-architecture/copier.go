package dotnetcleanarchitecture

import (
	"github.com/gertd/go-pluralize"
	"github.com/intelops/compage/internal/languages/executor"
	log "github.com/sirupsen/logrus"

	"strings"

	"github.com/intelops/compage/internal/utils"
)

const ApplicationPath = "/Application"
const ApplicationCSProjFile = "/Application/Application.csproj"

// commands
const ApplicationCommandsPath = "/Application/Commands"
const ApplicationCommandsCreateResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/CreateResourceNameCommand.cs.tmpl"
const ApplicationCommandsDeleteResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/DeleteResourceNameCommand.cs.tmpl"
const ApplicationCommandsUpdateResourceNameCommandCSFile = "/Application/Commands/ResourceNameService/UpdateResourceNameCommand.cs.tmpl"

// exceptions
const ApplicationExceptionsPath = "/Application/Exceptions"
const ApplicationExceptionsResourceNameExceptionFile = "/Application/Exceptions/ResourceNameNotFoundException.cs.tmpl"

// extensions
const ApplicationExtensionsPath = "/Application/Extensions"
const ApplicationExtensionsServiceRegistrationFile = "/Application/Extensions/ServiceRegistration.cs.tmpl"

// handlers
const ApplicationHandlersPath = "/Application/Handlers"
const ApplicationHandlersResourceNameServicePath = "/Application/Handlers/ResourceNameService"
const ApplicationHandlersCreateResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/CreateResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersDeleteResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/DeleteResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersUpdateResourceNameCommandHandlerCSFile = "/Application/Handlers/ResourceNameService/UpdateResourceNameCommandHandler.cs.tmpl"
const ApplicationHandlersGetResourceNameByIDQueryHandlerCSFile = "/Application/Handlers/ResourceNameService/GetResourceNameByIDQueryHandler.cs.tmpl"
const ApplicationHandlersGetAllResourceNamesQueryHandlerCSFile = "/Application/Handlers/ResourceNameService/GetAllResourceNamesQueryHandler.cs.tmpl"

// mappers
const ApplicationMappersPath = "/Application/Mappers"
const ApplicationMappersResourceNameMappingProfileFile = "/Application/Mappers/ResourceNameMappingProfile.cs.tmpl"

// queries
const ApplicationQueriesPath = "/Application/Queries"
const ApplicationQueriesResourceNameServicePath = "/Application/Queries/ResourceNameService"
const ApplicationQueriesGetAllResourceNamesQueryCSFile = "/Application/Queries/ResourceNameService/GetAllResourceNamesQuery.cs.tmpl"
const ApplicationQueriesGetResourceNameByIDQueryCSFile = "/Application/Queries/ResourceNameService/GetResourceNameByIDQuery.cs.tmpl"

// responses
const ApplicationResponsesPath = "/Application/Responses"
const ApplicationResponsesResourceNameResponseFile = "/Application/Responses/ResourceNameResponse.cs.tmpl"

const CorePath = "/Core"
const CoreCoreCSProjFile = "/Core/Core.csproj"

// common
const CoreCommonPath = "/Core/Common"
const CoreCommonEntityBaseFile = "/Core/Common/EntityBase.cs.tmpl"

// entities
const CoreEntitiesPath = "/Core/Entities"
const CoreEntitiesResourceNameFile = "/Core/Entities/ResourceName.cs.tmpl"

// repositories
const CoreRepositoriesPath = "/Core/Repositories"
const CoreRepositoriesIResourceNameRepositoryFile = "/Core/Repositories/IResourceNameRepository.cs.tmpl"
const CoreRepositoriesIAsyncRepositoryFile = "/Core/Repositories/IAsyncRepository.cs.tmpl"

const InfrastructurePath = "/Infrastructure"
const InfrastructureCSProjFile = "/Infrastructure/Infrastructure.csproj"

// data
const InfrastructureDataPath = "/Infrastructure/Data"
const InfrastructureDataDatabaseContextFile = "/Infrastructure/Data/DatabaseContext.cs.tmpl"
const InfrastructureDataDatabaseContextFactoryFile = "/Infrastructure/Data/DatabaseContextFactory.cs.tmpl"

// extensions
const InfrastructureExtensionsPath = "/Infrastructure/Extensions"
const InfrastructureExtensionsServiceCollectionExtensionsFile = "/Infrastructure/Extensions/ServiceCollectionExtensions.cs.tmpl"

// repositories
const InfrastructureRepositoriesPath = "/Infrastructure/Repositories"
const InfrastructureRepositoriesRepositoryBaseFile = "/Infrastructure/Repositories/RepositoryBase.cs.tmpl"
const InfrastructureRepositoriesResourceNameRepositoryFile = "/Infrastructure/Repositories/ResourceNameRepository.cs.tmpl"

const ProjectNamePath = "/ProjectName"
const ProjectNameCSProjFile = "/ProjectName/ProjectName.csproj"
const ProjectNameProgramFile = "/ProjectName/Program.cs.tmpl"
const ProjectNameCSProjUSerFile = "/ProjectName/ProjectName.csproj.user.tmpl"
const ProjectNameAppSettingsDevelopmentFile = "/ProjectName/appsettings.Development.json.tmpl"
const ProjectNameAppSettingsFile = "/ProjectName/appsettings.json.tmpl"

// controllers
const ProjectNameControllersPath = "/ProjectName/Controllers"
const ProjectNameControllersResourceNameServiceControllerFile = "/ProjectName/Controllers/ResourceNameServiceController.cs.tmpl"

// properties
const ProjectNamePropertiesPath = "/ProjectName/Properties"
const ProjectNamePropertiesLaunchSettingsFile = "/ProjectName/Properties/launchSettings.json.tmpl"

const TestsPath = "/Tests"
const TestsApplicationTestsCSProjFile = "/Tests/Application.Tests.csproj.tmpl"
const TestsGlobalUsingsFile = "/Tests/GlobalUsings.cs.tmpl"

// handlers
const TestsHandlersPath = "/Tests/Handlers"
const TestsHandlersResourceNameServicePath = "/Tests/Handlers/ResourceNameService"
const TestsHandlersCreateResourceNameCommandHandlerTestsCSFile = "/Tests/Handlers/ResourceNameService/CreateResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersDeleteResourceNameCommandHandlerTestsCSFile = "/Tests/Handlers/ResourceNameService/DeleteResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersUpdateResourceNameCommandHandlerTestsCSFile = "/Tests/Handlers/ResourceNameService/UpdateResourceNameCommandHandlerTests.cs.tmpl"
const TestsHandlersTestsHandlersGetResourceNameByIDQueryHandlerTestsCSFile = "/Tests/Handlers/ResourceNameService/GetResourceNameByIDQueryHandlerTests.cs.tmpl"
const TestsHandlersGetAllResourceNamesQueryHandlerTestsCSFile = "/Tests/Handlers/ResourceNameService/GetAllResourceNamesQueryHandlerTests.cs.tmpl"

// Copier Language specific *Copier
type Copier struct {
	NodeDirectoryName string
	TemplatesRootPath string
	Data              map[string]interface{}
	IsRestServer      bool
	RestServerPort    string
	PluralizeClient   *pluralize.Client
}

func NewCopier(gitPlatformURL, gitPlatformUserName, gitRepositoryName, nodeName, nodeDirectoryName, templatesRootPath string) *Copier {
	pluralizeClient := pluralize.NewClient()

	// populate map to replace templates
	data := map[string]interface{}{
		"GitRepositoryName":   gitRepositoryName,
		"NodeName":            strings.ToLower(nodeName),
		"GitPlatformUserName": gitPlatformUserName,
		"GitPlatformURL":      strings.Replace(gitPlatformURL, "https://", "", -1),
	}

	return &Copier{
		TemplatesRootPath: templatesRootPath,
		NodeDirectoryName: nodeDirectoryName,
		Data:              data,
		PluralizeClient:   pluralizeClient,
	}
}

// createRestServerDirectories creates rest server directories.
func (c *Copier) createRestServerDirectories() error {
	rootDirectory := c.NodeDirectoryName
	if err := utils.CreateDirectories(rootDirectory); err != nil {
		log.Errorf("error creating root directory: %v", err)
		return err
	}
	return nil
}

// CreateRestConfigs creates/copies relevant files to a generated project
func (c *Copier) CreateRestConfigs() error {
	if err := c.CreateRestServer(); err != nil {
		log.Errorf("error creating rest server: %v", err)
		return err
	}
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
