import {COMPAGE, GO_GIN_SERVER, GO_GRPC_SERVER} from "./node-properties/utils";

export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields?: Map<string, Map<string, string>>;
}

export interface RestConfig {
    template?: string;
    framework?: string;
    server?: {
        port?: string;
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
    framework?: string;
    server?: {
        port?: string;
        sqlDb?: string;
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
    framework?: string;
    server?: {
        port?: string;
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
    version?: string;
}

export interface CompageJsonConfig {
    edges: Map<string, CompageEdge>;
    nodes: Map<string, CompageNode>;
    version?: string;
    workspace: any;
    undoHistory: any;
    potentialNode: any;
    potentialEdge: any;
    plugins: any;
    panels: any;
    editor: any;
}

// empty interfaces
export const getEmptyRestConfig = () => {
    const emptyRestConfig: RestConfig = {
        template: COMPAGE,
        framework: GO_GIN_SERVER,
        server: {
            resources: [],
            port: "",
            sqlDb: "",
            openApiFileYamlContent: ""
        },
        clients: []
    };
    return emptyRestConfig;
};

export const getEmptyGrpcConfig = () => {
    const emptyGrpcConfig: GrpcConfig = {
        template: COMPAGE,
        framework: GO_GRPC_SERVER,
        server: {
            resources: [],
            port: "",
            sqlDb: "",
            protoFileContent: ""
        },
        clients: []
    };
    return emptyGrpcConfig;
};

export const getEmptyWsConfig = () => {
    const emptyWsConfig: WsConfig = {
        template: COMPAGE,
        // TODO add default framework here later when support for ws is added.
        framework: "",
        server: {
            resources: [],
            port: "",
        },
        clients: []
    };
    return emptyWsConfig;
};

export const EmptyCurrentRestResource: Resource = {
    name: "",
    fields: new Map<string, Map<string, string>>()
};

export const EmptyCurrentGrpcResource: Resource = {
    name: "",
    fields: new Map<string, Map<string, string>>()
};