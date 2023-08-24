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

export interface Repository {
    provider?: string;
    providerUrl?: string;
    name: string;
    branch: string;
    isPublic: boolean;
}

// all keys are of string format
// grpc client request
export interface Project {
    projectName: string;
    userName: string;
    json: string;
    repositoryName: string;
    metadata: string;
}

export interface UploadYamlRequest {
    nodeId: string;
    projectId: string;
    file: any;
}

// This type describes the response object structure:
export interface UploadYamlResponse {
    nodeId: string;
    projectId: string;
    content: string;
    message: string;
}

// This type describes the error object structure:
export interface UploadYamlError {
    message: string;
}

export interface GetCurrentContextRequest {
}

// This type describes the response object structure:
export interface GetCurrentContextResponse {
    contextName: string;
}

// This type describes the error object structure:
export interface GetCurrentContextError {
    message: string;
}

// ProjectEntity is for transferring info about projects from client to server
export interface ProjectEntity {
    id: string;
    displayName: string;
    version: string;
    user: User;
    json: CompageJson;
    repository: Repository;
    // TODO temporary made optional.
    metadata?: Map<string, string>;
}

export interface User {
    name: string;
    email: string;
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

export interface LoginError {
    message: string;
}

export interface CreateProjectResponse {
    project: ProjectEntity;
    message: string;
}

export interface CreateProjectError {
    message: string;
}

export interface UpdateProjectResponse {
    project: ProjectEntity;
    message: string;
}

export interface UpdateProjectError {
    message: string;
}

export interface DeleteProjectError {
    message: string;
}

export const initializeEmptyProjectEntity = () => {
    const repository: Repository = {branch: '', name: '', isPublic: false, providerUrl: '', provider: ''};
    const user: User = {email: '', name: ''};
    const json: CompageJson = {
        edges: new Map<string, CompageEdge>(),
        nodes: new Map<string, CompageNode>(),
        version: '',
        editor: {},
        panels: {},
        plugins: {},
        undoHistory: {},
        workspace: {},
        potentialEdge: {},
        potentialNode: {}
    };
    const projectEntity: ProjectEntity = {
        displayName: '',
        id: '',
        metadata: new Map<string, string>(),
        repository,
        user,
        version: '',
        json
    };
    return projectEntity;
};