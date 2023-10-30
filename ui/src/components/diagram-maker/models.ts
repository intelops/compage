import {COMPAGE, GO_GIN_SERVER, GO_GRPC_SERVER} from "./node-properties/utils";

export interface Resource {
    name: string;
    allowedMethods?: string[];
    // the below map can contain metadata about the field.
    fields?: Map<string, FieldMetadata>;
}

export interface FieldMetadata {
    datatype: string;
    isComposite: boolean;
}

export interface RestConfig {
    template?: string;
    framework?: string;
    server?: {
        port?: string;
        sqlDB?: string;
        noSQLDB?: string;
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
        sqlDB?: string;
        noSQLDB?: string;
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
    workspace?: any;
    undoHistory?: any;
    potentialNode?: any;
    potentialEdge?: any;
    plugins?: any;
    panels?: any;
    editor?: any;
}

// empty interfaces
export const getEmptyRestConfig = () => {
    const emptyRestConfig: RestConfig = {
        template: COMPAGE,
        framework: GO_GIN_SERVER,
        server: {
            resources: [],
            port: "",
            sqlDB: "",
            noSQLDB: "",
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
            sqlDB: "",
            noSQLDB:"",
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
    allowedMethods: [],
    fields: new Map<string, FieldMetadata>()
};

export const EmptyCurrentGrpcResource: Resource = {
    name: "",
    allowedMethods: [],
    fields: new Map<string, FieldMetadata>()
};