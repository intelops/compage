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
	ClientTypes            []ClientType           `json:"clientTypes,omitempty"`
	Metadata               map[string]interface{} `json:"metadata,omitempty"`
	Annotations            map[string]string      `json:"annotations,omitempty"`
	ExternalNode           string                 `json:"externalNode,omitempty"`
	OpenApiFileYamlContent string                 `json:"openApiFileYamlContent,omitempty"`
}

// ClientType holds information for an edge
type ClientType struct {
	Protocol string `json:"protocol"`
	Port     string `json:"port"`
	// Framework will be the same as client's rest server framework.
	// Framework string `json:"framework"`
}
