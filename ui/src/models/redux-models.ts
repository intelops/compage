// Auth
export interface AuthenticationModel {
    login?: string,
    email?: string,
    name?: string,
    following: string,
    followers: string,
    public_repos: string,
    avatar_url: string,
    bio: string
}

export interface AuthenticationArrayModel {
    user: AuthenticationModel
}

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
    tag?: string,
    branch?: string
}

export interface CreateProjectRequest {
    projectName?: string,
    userName?: string,
    yaml: CompageYaml,
    repository: Repository,
    metadata?: Map<string, string>,
    email: string
}

export interface CreatedProjectModel {
    "name": string,
    "fileChunk": any
}

export interface CreatedProjectArrayModel {
    // In `status` we will watch
    // if todos are being loaded.
    status: "loading" | "idle";
    // `error` will contain an error message.
    error: string | null;
    createdProject: CreatedProjectModel
}

// github