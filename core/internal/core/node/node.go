package node

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `json:"consumerData,omitempty"`
	ID           string       `json:"id"`
	TypeID       string       `json:"typeId"`
}

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	// Language node's(component) language.
	Language string `json:"language"`
	// Template its template to be used to generate code.
	Template string `json:"template"`
	// Name of component (required, this will be service and deployment name).
	Name string `json:"name"`
	// RestServerType holds all config related to REST server. If nil, it means that the node is not REST server.
	RestServerType *RestServerType `json:"restServerType,omitempty"`
	// GrpcServerType holds all config related to gRPC server. If nil, it means that the node is not gRPC server.
	GrpcServerType *GrpcServerType `json:"grpcServerType,omitempty"`
	// WsServerType holds all config related to ws server. If nil, it means that the node is not ws server.
	WsServerType *WsServerType `json:"wsServerType,omitempty"`
	// Metadata holds misc information about the node.
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	// Annotations holds annotations for the node.
	Annotations map[string]string `json:"annotations,omitempty"`
}

type RestServerType struct {
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
	// OpenApiFileYamlContent holds openApiFileYamlContent
	OpenApiFileYamlContent string `json:"openApiFileYamlContent,omitempty"`
}

type GrpcServerType struct {
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
	// ProtoFileContent holds protoFileContent
	ProtoFileContent string `json:"protoFileContent,omitempty"`
}

type WsServerType struct {
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	Name string `json:"name"`
	// resources fields (e.g. name, age in user)
	Fields map[string]string `json:"fields"`
}
