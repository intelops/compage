package node

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	Template string `yaml:"template"`
	// Name of component (required, this will be service and deployment name)
	Name        string              `yaml:"name"`
	NodeType    string              `yaml:"nodeType"`
	ServerTypes []map[string]string `yaml:"serverTypes"`
	URL         string              `yaml:"url"`
	// resources can be multiple (user, account)
	Resources   []Resource             `yaml:"resources"`
	Metadata    map[string]interface{} `yaml:"metadata"`
	Annotations map[string]string      `yaml:"annotations"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}
