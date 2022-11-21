package node

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	Template string `yaml:"template"`
	// Name of component (required, this will be service and deployment name)
	Name        string                 `yaml:"name"`
	NodeType    string                 `yaml:"nodeType"`
	ServerTypes []ServerType           `yaml:"serverTypes,omitempty"`
	URL         string                 `yaml:"url"`
	Metadata    map[string]interface{} `yaml:"metadata,omitempty"`
	Annotations map[string]string      `yaml:"annotations,omitempty"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	Name string `json:"name"`
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}

type ServerType struct {
	Protocol  string     `json:"protocol"`
	Port      string     `json:"port"`
	Framework string     `json:"framework"`
	Resources []Resource `json:"resources"`
}
