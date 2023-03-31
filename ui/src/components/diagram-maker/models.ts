export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields: Map<string, Map<string, string>>;
}

export interface RestServerConfig {
    template: string;
    port: string;
    framework?: string;
    resources?: Resource[];
    openApiFileYamlContent?: string;
}

export interface GrpcServerConfig {
    port: string;
    framework?: string;
    resources?: Resource[];
    protoFileContent?: string;
}

export interface WsServerConfig {
    port: string;
    framework?: string;
    resources?: Resource[];
}

export interface NodeConsumerData {
    name: string;
    template: string;
    restServerConfig?: RestServerConfig;
    grpcServerConfig?: GrpcServerConfig;
    wsServerConfig?: WsServerConfig;
    language: string;
    metadata: Map<string, string>;
    annotations: Map<string, string>;
}

export interface CompageNode {
    id: string;
    typeId: string;
    consumerData: NodeConsumerData;
}

export interface RestClientConfig {
    port: string;
}

export interface GrpcClientConfig {
    port: string;
}

export interface WsClientConfig {
    port: string;
}

export interface EdgeConsumerData {
    name: string;
    externalNode: string;
    restClientConfig: RestClientConfig;
    grpcClientConfig: GrpcClientConfig;
    wsClientConfig: WsClientConfig;
    metadata: Map<string, string>;
    annotations: Map<string, string>;
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

// empty interfaces
export const EmptyRestServerConfig: RestServerConfig = {
    template: "",
    resources: [],
    port: "",
    framework: "",
    openApiFileYamlContent: ""
};

export const EmptyGrpcServerConfig: GrpcServerConfig = {
    resources: [],
    port: "",
    framework: "",
    protoFileContent: ""
};

export const EmptyWsServerConfig: WsServerConfig = {
    resources: [],
    port: "",
    framework: "",
};