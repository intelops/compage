import {
  FormData,
  MicroServiceDatabaseId,
  MicroServiceFramework,
  MicroServiceFrameworkId,
  MicroServiceLanguageId,
  MicroServiceNoSQLDatabase,
  MicroServiceServerType,
  MicroServiceSQLDatabase,
  MicroServiceSupportedLanguages,
  MicroServiceTemplate,
  MicroServiceTemplateId,
  TMicroServiceNodeFormData,
} from "./Microservice.node.types";

export const INITIAL_FORM_VALUES: Partial<TMicroServiceNodeFormData> = {
  name: "",
  language: undefined,
};

export const LANGUAGE_DATA: MicroServiceSupportedLanguages[] = [
  {
    id: MicroServiceLanguageId.Java,
    label: "Java",
    value: "java",
  },
  {
    id: MicroServiceLanguageId.Javascript,
    label: "Javascript",
    value: "javascript",
  },
  {
    id: MicroServiceLanguageId.Go,
    label: "Go",
    value: "go",
  },
  {
    id: MicroServiceLanguageId.Rust,
    label: "Rust",
    value: "rust",
  },
  {
    id: MicroServiceLanguageId.Ruby,
    label: "Ruby",
    value: "ruby",
  },
  {
    id: MicroServiceLanguageId.Python,
    label: "Python",
    value: "python",
  },
];

export const TEMPLATE_DATA: MicroServiceTemplate[] = [
  {
    id: MicroServiceTemplateId.Compage,
    label: "Compage",
  },
  {
    id: MicroServiceTemplateId.OpenAPI,
    label: "OpenAPI",
  },
];

export const FRAMEWORK_DATA: MicroServiceFramework[] = [
  {
    id: MicroServiceFrameworkId.GoGinServer,
    label: "Go Gin Server",
  },
  {
    id: MicroServiceFrameworkId.GoServer,
    label: "Go Server",
  },
  {
    id: MicroServiceFrameworkId.GoEchoServer,
    label: "Go Echo Server",
  },
  {
    id: MicroServiceFrameworkId.JavaMicronautServer,
    label: "Java Micronaut Server",
  },
  {
    id: MicroServiceFrameworkId.JavaUndertowServer,
    label: "Java Undertow Server",
  },
  {
    id: MicroServiceFrameworkId.Spring,
    label: "Spring",
  },
  {
    id: MicroServiceFrameworkId.NodejsExpressServer,
    label: "Nodejs Express Server",
  },
  {
    id: MicroServiceFrameworkId.RustServer,
    label: "Rust Server",
  },
  {
    id: MicroServiceFrameworkId.RubyOnRails,
    label: "Ruby on Rails",
  },
  {
    id: MicroServiceFrameworkId.RubySinatra,
    label: "Ruby Sinatra",
  },
  {
    id: MicroServiceFrameworkId.PythonFlask,
    label: "Python Flask",
  },
];
export const SQL_DATABASE_DATA: MicroServiceSQLDatabase[] = [
  {
    id: MicroServiceDatabaseId.MySQL,
    label: "MySQL",
  },
  {
    id: MicroServiceDatabaseId.SQLite,
    label: "SQLite",
  },
  {
    id: MicroServiceDatabaseId.Map,
    label: "Map",
  },
  {
    id: MicroServiceDatabaseId.SqLiteGORM,
    label: "SQLite with GORM",
  },
  {
    id: MicroServiceDatabaseId.MySQLGORM,
    label: "MySQL with GORM",
  },
];
export const NO_SQL_DATABASE_DATA: MicroServiceNoSQLDatabase[] = [
  {
    id: MicroServiceDatabaseId.MongoDB,
    label: "MongoDB",
  },
  {
    id: MicroServiceDatabaseId.Map,
    label: "Map",
  },
];
export const formData: FormData = {
  language: {
    [MicroServiceLanguageId.Go]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.Compage,
            supportedFrameworks: [
              MicroServiceFrameworkId.GoGinServer,
            ],
          },
          {
            id: MicroServiceTemplateId.OpenAPI,
            supportedFrameworks: [
              MicroServiceFrameworkId.GoServer,
              MicroServiceFrameworkId.GoGinServer,
              MicroServiceFrameworkId.GoEchoServer,
            ],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.Compage,
            supportedFrameworks: [
              MicroServiceFrameworkId.GoGinServer,
            ],
          },
        ],
      },
    },
    [MicroServiceLanguageId.Java]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.Compage,
            supportedFrameworks: [
              MicroServiceFrameworkId.JavaMicronautServer,
              MicroServiceFrameworkId.JavaUndertowServer,
              MicroServiceFrameworkId.Spring,
            ],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [],
      },
    },
    [MicroServiceLanguageId.Javascript]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.OpenAPI,
            supportedFrameworks: [MicroServiceFrameworkId.NodejsExpressServer],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [],
      },
    },
    [MicroServiceLanguageId.Rust]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.OpenAPI,
            supportedFrameworks: [MicroServiceFrameworkId.RustServer],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [],
      },
    },
    [MicroServiceLanguageId.Ruby]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.OpenAPI,
            supportedFrameworks: [
              MicroServiceFrameworkId.RubyOnRails,
              MicroServiceFrameworkId.RubySinatra,
            ],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [],
      },
    },
    [MicroServiceLanguageId.Python]: {
      [MicroServiceServerType.RestServer]: {
        templates: [
          {
            id: MicroServiceTemplateId.OpenAPI,
            supportedFrameworks: [
              MicroServiceFrameworkId.PythonFlask,
            ],
          },
        ],
      },
      [MicroServiceServerType.GRPCServer]: {
        templates: [],
      },
    },
  },
};
