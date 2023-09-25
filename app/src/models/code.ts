export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields: Map<string, FieldMetadata>;
}

export interface FieldMetadata {
    datatype: string;
    isComposite: boolean;
}

export interface RestConfig {
    template: string;
    framework: string;
    server: {
        port: string;
        sqlDB: string;
        noSQLDB: string;
        resources?: Resource[];
        openApiFileYamlContent?: string;
    };
    clients: RestClient[];
}

export interface RestClient {
    sourceNodeName: string;
    sourceNodeId: string;
    port: string;
}

export interface GrpcConfig {
    template: string;
    framework: string;
    server?: {
        port?: string;
        sqlDB: string;
        noSQLDB: string;
        resources?: Resource[];
        protoFileContent?: string;
    };
    clients?: GrpcClient[];
}

export interface GrpcClient {
    sourceNodeName: string;
    sourceNodeId: string;
    port: string;
}

export interface WsConfig {
    template: string;
    framework: string;
    server?: {
        port?: string;
        sqlDB: string;
        noSQLDB: string;
        resources?: Resource[];
    };
    clients?: WsClient[];
}

export interface WsClient {
    sourceNodeName: string;
    sourceNodeId: string;
    port: string;
}

export interface NodeConsumerData {
    name: string;
    restConfig?: RestConfig;
    grpcConfig?: GrpcConfig;
    wsConfig?: WsConfig;
    language: string;
    metadata: Map<string, string>;
    annotations: Map<string, string>;
}

export interface CompageNode {
    id: string;
    typeId: string;
    consumerData: NodeConsumerData;
}

export interface EdgeConsumerData {
    name: string;
    metadata?: Map<string, string>;
    annotations?: Map<string, string>;
}

export interface CompageEdge {
    id: string;
    src: string;
    dest: string;
    consumerData: EdgeConsumerData;
}

export interface CompageJson {
    edges: Map<string, CompageEdge>;
    nodes: Map<string, CompageNode>;
    version?: string;
    workspace?: any;
    undoHistory?: any;
    potentialNode?: any;
    potentialEdge?: any;
    plugins?: any;
    panels?: any;
    editor?: any;
}

// This is going to be used when the generate code request is sent to the server
// all keys are of string format
// grpc client request
export interface Project {
    projectName: string;
    userName: string;
    json: string;
    gitRepositoryName: string;
    gitRepositoryIsPublic: boolean;
    gitRepositoryBranch: string;
    gitPlatformName: string;
    gitPlatformURL: string;
    gitPlatformUserName: string;
    metadata: string;
}

export interface GenerateCodeRequest {
    projectId: string;
}

export interface GenerateCodeResponse {
    projectId: string;
    userName: string;
    message: string;
}

export interface GenerateCodeError {
    message: string;
}


export const getGenerateCodeResponse = (userName: string, projectId: string, message: string) => {
    const generateCodeResponse: GenerateCodeResponse = {
        userName,
        projectId,
        message,
    };
    return generateCodeResponse;
};

export const getGenerateCodeError = (message: string) => {
    const generateCodeError: GenerateCodeError = {
        message,
    };
    return generateCodeError;
};
