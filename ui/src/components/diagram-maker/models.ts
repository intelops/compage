export interface Resource {
    name: string;
    // the below map can contain metadata about the field.
    fields: Map<string, Map<string, string>>;
}

export interface ServerType {
    protocol: string;
    port: string;
    framework: string;
    resources: Resource[];
}

export interface NodeConsumerData {
    name: string;
    template: string;
    serverTypes?: ServerType[];
    language: string;
    metadata: Map<string, string>;
    annotations: Map<string, string>;
}

export interface CompageNode {
    id: string;
    typeId: string;
    consumerData: NodeConsumerData;
}

export interface ClientType {
    port: string;
    protocol: string;
}

export interface EdgeConsumerData {
    externalNodeName: string;
    clientTypes: ClientType[];
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


// Rest Protocol
export const Rest = "REST"

// Grpc Protocol
export const Grpc = "GRPC"

// Ws Protocol
export const Ws = "WS"