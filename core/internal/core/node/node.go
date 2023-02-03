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
	// ServerTypes holds all config related to server. If nil, it means that the node is just client and not server.
	ServerTypes []ServerType `json:"serverTypes,omitempty"`
	// Metadata holds misc information about the node.
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	// Annotations holds annotations for the node.
	Annotations map[string]string `json:"annotations,omitempty"`
}

type ServerType struct {
	Protocol  string     `json:"protocol"`
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
	// OpenApiFileYamlContent holds openApiFileYamlContent
	OpenApiFileYamlContent string `json:"openApiFileYamlContent,omitempty"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	Name string `json:"name"`
	// resources fields (e.g. name, age in user)
	Fields map[string]string `json:"fields"`
}
