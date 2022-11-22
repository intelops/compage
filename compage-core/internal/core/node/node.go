package node

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	// IsServer depicts if the node is server.
	IsServer bool `yaml:"isServer"`
	// Language node's(component) language.
	Language string `yaml:"language"`
	// Template its template to be used to generate project.
	Template string `yaml:"template"`
	// Name of component (required, this will be service and deployment name).
	Name string `yaml:"name"`
	// NodeType holds type node (circle/rectangle)
	NodeType string `yaml:"nodeType"`
	// ServerTypes holds all config related to server.
	ServerTypes []ServerType `yaml:"serverTypes,omitempty"`
	URL         string       `yaml:"url"`
	// Metadata holds misc information about the node.
	Metadata map[string]interface{} `yaml:"metadata,omitempty"`
	// Annotations holds annotations for the node.
	Annotations map[string]string `yaml:"annotations,omitempty"`
}

type ServerType struct {
	Protocol  string     `json:"protocol"`
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	Name string `json:"name"`
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}
