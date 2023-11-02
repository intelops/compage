package corenode

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
	// Name of a component (required, this will be service and deployment name).
	Name string `json:"name"`
	// RestConfig holds all config related to REST. If nil, it means that the node is not REST server or has REST clients.
	RestConfig *RestConfig `json:"restConfig,omitempty"`
	// GrpcConfig holds all config related to gRPC. If nil, it means that the node is not gRPC server or has gRPC clients.
	GrpcConfig *GrpcConfig `json:"grpcConfig,omitempty"`
	// WsConfig holds all config related to ws. If nil, it means that the node is not ws server or has WS clients.
	WsConfig *WsConfig `json:"wsConfig,omitempty"`
	// Metadata holds misc information about the node.
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	// Annotations hold annotations for the node.
	Annotations map[string]string `json:"annotations,omitempty"`
}

type RestServer struct {
	Port      string      `json:"port"`
	SQLDB     string      `json:"sqlDB"`
	NoSQLDB   string      `json:"noSQLDB"`
	Resources []*Resource `json:"resources"`
	// OpenAPIFileYamlContent holds openAPIFileYamlContent
	OpenAPIFileYamlContent string `json:"openAPIFileYamlContent,omitempty"`
}

type RestClient struct {
	SourceNodeName string `json:"sourceNodeName"`
	SourceNodeID   string `json:"sourceNodeId"`
	Port           string `json:"port"`
	// The below given, two keys are populated in language node and are used to create server's clients.
	Resources              []*Resource `json:"resources"`
	OpenAPIFileYamlContent string      `json:"openAPIFileYamlContent,omitempty"`
}

type RestConfig struct {
	Template  string        `json:"template"`
	Framework string        `json:"framework"`
	Server    *RestServer   `json:"server"`
	Clients   []*RestClient `json:"clients"`
}

type GrpcServer struct {
	Port      string      `json:"port"`
	SQLDB     string      `json:"sqlDB"`
	NoSQLDB   string      `json:"noSQLDB"`
	Resources []*Resource `json:"resources"`
	// ProtoFileContent holds protoFileContent
	ProtoFileContent string `json:"protoFileContent,omitempty"`
}

type GrpcClient struct {
	SourceNodeName string `json:"sourceNodeName"`
	SourceNodeID   string `json:"sourceNodeId"`
	Port           string `json:"port"`
	// the below given, two keys are populated in language node and are used to create server's clients.
	Resources        []*Resource `json:"resources"`
	ProtoFileContent string      `json:"protoFileContent,omitempty"`
}

type GrpcConfig struct {
	Template  string        `json:"template"`
	Framework string        `json:"framework"`
	Server    *GrpcServer   `json:"server"`
	Clients   []*GrpcClient `json:"clients"`
}

type WsServer struct {
	Port      string     `json:"port"`
	Resources []Resource `json:"resources"`
}

type WsClient struct {
	SourceNodeName string `json:"sourceNodeName"`
	SourceNodeID   string `json:"sourceNodeId"`
	Port           string `json:"port"`
	// the below given, two keys are populated in language node and are used to create server's clients.
	Resources []Resource `json:"resources"`
}

type WsConfig struct {
	Template  string      `json:"template"`
	Framework string      `json:"framework"`
	Server    *WsServer   `json:"server"`
	Clients   []*WsClient `json:"clients"`
}

type FieldMetadata struct {
	Type        string `json:"datatype,omitempty"`
	IsComposite bool   `json:"isComposite,omitempty"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	Name           string    `json:"name"`
	AllowedMethods []*string `json:"allowedMethods"`
	// resource fields (e.g., name, age in user)
	Fields map[string]FieldMetadata `json:"fields"`
}
