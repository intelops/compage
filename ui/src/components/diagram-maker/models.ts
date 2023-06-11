import {COMPAGE} from "./node-properties/utils";

export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields?: Map<string, Map<string, string>>;
}

export interface RestConfig {
    template?: string;
    server?: {
        port?: string;
        framework?: string;
        sqlDb?: string;
        resources?: Resource[];
        openApiFileYamlContent?: string;
    };
    clients?: RestClient[];
}

export interface RestClient {
    sourceNodeName: string;
    sourceNodeId: string;
    port: string;
}

export interface GrpcConfig {
    template?: string;
    server?: {
        port?: string;
        sqlDb?: string;
        framework?: string;
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
    template?: string;
    server?: {
        port?: string;
        framework?: string;
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
export const EmptyRestConfig: RestConfig = {
    template: COMPAGE,
    server: {
        resources: [],
        port: "",
        framework: "",
        sqlDb: "",
        openApiFileYamlContent: ""
    },
    clients: []
};

export const EmptyGrpcConfig: GrpcConfig = {
    template: COMPAGE,
    server: {
        resources: [],
        port: "",
        sqlDb: "",
        framework: "",
        protoFileContent: ""
    },
    clients: []
};

export const EmptyWsConfig: WsConfig = {
    template: COMPAGE,
    server: {
        resources: [],
        port: "",
        framework: "",
    },
    clients: []
};

export const EmptyCurrentRestResource: Resource = {
    name: "",
    fields: new Map<string, Map<string, string>>()
};

export const EmptyCurrentGrpcResource: Resource = {
    name: "",
    fields: new Map<string, Map<string, string>>()
};