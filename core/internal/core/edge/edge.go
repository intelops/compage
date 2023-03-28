package edge

// Edge can have connection details such as port (Assumption is that the port mentioned is of SRC in edge)
type Edge struct {
	Dest         string       `json:"dest"`
	ID           string       `json:"id"`
	Src          string       `json:"src"`
	ConsumerData ConsumerData `json:"consumerData,omitempty"`
}

// ConsumerData has detailed attributes of an edge
type ConsumerData struct {
	RestClientConfig *RestClientConfig      `json:"restClientConfig,omitempty"`
	GrpcClientConfig *GrpcClientConfig      `json:"grpcClientConfig,omitempty"`
	WsClientConfig   *WsClientConfig        `json:"wsClientConfig,omitempty"`
	Metadata         map[string]interface{} `json:"metadata,omitempty"`
	Annotations      map[string]string      `json:"annotations,omitempty"`
	ExternalNode     string                 `json:"externalNode,omitempty"`
	Name             string                 `json:"name"`
}

// RestClientConfig holds information for an edge for rest protocol.
type RestClientConfig struct {
	Port string `json:"port"`
}

// GrpcClientConfig holds information for an edge for grpc protocol.
type GrpcClientConfig struct {
	Port string `json:"port"`
}

// WsClientConfig holds information for an edge for ws protocol.
type WsClientConfig struct {
	Port string `json:"port"`
}
