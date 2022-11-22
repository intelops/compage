package node

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	// Language node's(component) language.
	Language string `yaml:"language"`
	// Template its template to be used to generate project.
	Template string `yaml:"template"`
	// Name of component (required, this will be service and deployment name).
	Name string `yaml:"name"`
	// ServerTypes holds all config related to server. If nil, it means that the node is just client and not server.
	ServerTypes []ServerType `yaml:"serverTypes,omitempty"`
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
