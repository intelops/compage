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
	// Name of component (required, this will be service and deployment name).
	Name string `json:"name"`
	// RestServerConfig holds all config related to REST server. If nil, it means that the node is not REST server.
	RestServerConfig *RestServerConfig `json:"restServerConfig,omitempty"`
	// GrpcServerConfig holds all config related to gRPC server. If nil, it means that the node is not gRPC server.
	GrpcServerConfig *GrpcServerConfig `json:"grpcServerConfig,omitempty"`
	// WsServerConfig holds all config related to ws server. If nil, it means that the node is not ws server.
	WsServerConfig *WsServerConfig `json:"wsServerConfig,omitempty"`
	// Metadata holds misc information about the node.
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	// Annotations holds annotations for the node.
	Annotations map[string]string `json:"annotations,omitempty"`
}

type RestServerConfig struct {
	Template  string     `json:"template"`
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
	// OpenAPIFileYamlContent holds openAPIFileYamlContent
	OpenAPIFileYamlContent string `json:"openAPIFileYamlContent,omitempty"`
}

type GrpcServerConfig struct {
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
	// ProtoFileContent holds protoFileContent
	ProtoFileContent string `json:"protoFileContent,omitempty"`
}

type WsServerConfig struct {
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
