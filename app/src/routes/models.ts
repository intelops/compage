export interface Resource {
    Name: string,
    // the below map can contain metadata about the field.
    Fields: Map<string, Map<string, string>>
}

export interface ServerType {
    protocol: string,
    port: string,
    framework: string,
    resources: Resource[]
}

export interface NodeConsumerData {
    name: string,
    template: string,
    serverTypes: ServerType[],
    language: string,
    metadata?: Map<string, string>,
    annotations?: Map<string, string>
}

export interface CompageNode {
    id: string,
    typeId: string,
    consumerData: NodeConsumerData
}

export interface ClientType {
    port: string,
    protocol: string
}

export interface EdgeConsumerData {
    externalNodeName: string,
    clientTypes: ClientType[],
    metadata?: Map<string, string>,
    annotations?: Map<string, string>
}

export interface CompageEdge {
    id: string,
    src: string,
    dest: string,
    consumerData: EdgeConsumerData
}

export interface CompageYaml {
    edges: Map<string, CompageEdge>,
    nodes: Map<string, CompageNode>
    version: string
}

export interface Repository {
    name: string,
    tag: string,
    branch: string
}

// all keys are of string format
// grpc client request
export interface Project {
    projectName: string,
    userName: string,
    yaml: string,
    repositoryName: string,
    metadata: string
}

// ProjectEntity is for transferring info about projects from client to server
export interface ProjectEntity {
    id: string,
    displayName: string,
    version: string,
    user: User,
    yaml: CompageYaml,
    repository: Repository,
    metadata: Map<string, string>
}

export interface User {
    name: string,
    email: string
}

export interface GenerateCodeRequest {
    projectId: string,
}

export interface GenerateCodeResponse {
    projectId: string,
    userName: string,
    message: string,
    error: string,
}

export const initializeEmptyProjectEntity = () => {
    const repository: Repository = {branch: "", name: "", tag: ""};
    const user: User = {email: "", name: ""};
    const yaml: CompageYaml = {
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
        yaml: yaml
    }
    return projectEntity
}