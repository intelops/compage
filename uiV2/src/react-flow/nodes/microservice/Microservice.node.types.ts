import { SelectData, SelectProps } from "@/components/Select/Select.types";

export type TMicroServiceNodeData = {
  description?: string;
  name: string;
};

export type MicroServiceSupportedLanguages = {
  id: string;
  label: string;
  value: string;
};
// all these are of the type SelectProps because most of them are in the dropdown format
type MicroServiceDatabaseName = SelectData;
type MicroServiceAttributeDataType = SelectData;

type MicroServiceServer = {
  template: MicroServiceTemplate;
  framework: MicroServiceFramework;
  port: number;
  sqlDatabase: {
    sqlDatabaseName: MicroServiceDatabaseName;
  };
  noSQLDatabase: {
    noSQLDatabaseName: MicroServiceDatabaseName;
  };
  resources: MicroServiceResource[];
};

type MicroServiceResource = {
  name: string;
  attributes: {
    attribute: string;
    type: MicroServiceAttributeDataType;
  }[];
};

export interface TMicroServiceNodeFormData {
  name: string;
  language: MicroServiceLanguageId;
  restServer: MicroServiceServer;
  gRPCServer: MicroServiceServer;
}
export enum MicroServiceLanguageId {
  Java = "java",
  Javascript = "javascript",
  Go = "go",
  Rust = "rust",
  Ruby = "ruby",
  Python = "python",
}

export enum MicroServiceServerType {
  RestServer = "restServer",
  GRPCServer = "gRPCServer",
}

export enum MicroServiceTemplateId {
  Compage = "compage",
  OpenAPI = "openAPI",
}
export type MicroServiceTemplate = {
  id: MicroServiceTemplateId;
  label: string;
  [key: string]: any;
};
export enum MicroServiceFrameworkId {
  GoGinServer = "go-gin-server",
  GoServer = "go-server",
  GoEchoServer = "go-echo-server",
  JavaMicronautServer = "java-micronaut-server",
  JavaUndertowServer = "java-undertow-server",
  Spring = "spring",
  NodejsExpressServer = "nodejs-express-server",
  RustServer = "rust-server",
  RubyOnRails = "ruby-on-rails",
  RubySinatra = "ruby-sinatra",
  PythonFlask = "python-flask",
}
export type MicroServiceFramework = {
  id: MicroServiceFrameworkId;
  label: string;
  [key: string]: any;
};

export enum MicroServiceDatabaseId {
  MySQL = "mysql",
  SQLite = "sqlite",
  Map = "map",
  SqLiteGORM = "sqlite-gorm",
  MySQLGORM = "mysql-gorm",
  MongoDB = "mongodb",
}
export type MicroServiceSQLDatabase = {
  id: MicroServiceDatabaseId;
  label: string;
  [key: string]: any;
};
export type MicroServiceNoSQLDatabase = {
  id: MicroServiceDatabaseId;
  label: string;
  [key: string]: any;
};
export type FormData = {
  language: {
    [key in MicroServiceLanguageId]: {
      [MicroServiceServerType.RestServer]: {
        templates: {
          id: MicroServiceTemplateId;
          supportedFrameworks: MicroServiceFrameworkId[];
        }[];
      };
      [MicroServiceServerType.GRPCServer]: {
        templates: {
          id: MicroServiceTemplateId;
          supportedFrameworks: MicroServiceFrameworkId[];
        }[];
      };
    };
  };
};
