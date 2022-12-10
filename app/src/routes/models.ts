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
    metadata: Map<string, string>,
    annotations: Map<string, string>
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
    metadata: Map<string, string>,
    annotations: Map<string, string>
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

export interface ProjectEntity {
    id?: string,
    name: string,
    user?: User,
    yaml?: CompageYaml,
    repository?: Repository,
    metadata?: Map<string, string>,
    version?: string
}

export interface User {
    name: string,
    email: string
}

export interface CreateProjectRequest {
    project: ProjectEntity,
    user: User,
    yaml: CompageYaml,
    repository: Repository,
    metadata?: Map<string, string>,
}

export interface GenerateProjectRequest {
    project: ProjectEntity,
    user: User,
    yaml: CompageYaml,
    repository: Repository,
    metadata?: Map<string, string>,
}

export interface GenerateProjectResponse {
    projectName?: string,
    userName?: string,
    repositoryName: string,
    message: string,
    error: string,
}