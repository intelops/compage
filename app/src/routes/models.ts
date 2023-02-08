export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields: Map<string, Map<string, string>>;
}

export interface ServerType {
    protocol: string;
    port: string;
    framework: string
    resources: Resource[];
    OpenApiFileYamlContent: string;
}

export interface NodeConsumerData {
    name: string;
    template: string;
    serverTypes: ServerType[];
    language: string;
    metadata?: Map<string, string>;
    annotations?: Map<string, string>;
}

export interface CompageNode {
    id: string,
    typeId: string,
    consumerData: NodeConsumerData
}

export interface ClientType {
    port: string;
    protocol: string;
}

export interface EdgeConsumerData {
    externalNodeName: string;
    clientTypes: ClientType[];
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
    version: string;
}

export interface Repository {
    name: string;
    tag: string;
    branch: string;
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
    const repository: Repository = {branch: "", name: "", tag: ""};
    const user: User = {email: "", name: ""};
    const json: CompageJson = {
        edges: new Map<string, CompageEdge>(),
        nodes: new Map<string, CompageNode>(),
        version: ""
    };
    const projectEntity: ProjectEntity = {
        displayName: "",
        id: "",
        metadata: new Map<string, string>(),
        repository: repository,
        user: user,
        version: "",
        json: json
    }
    return projectEntity
}