package node

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	// Name of component
	Name        string `yaml:"name"`
	NodeType    string `yaml:"nodeType"`
	ServerTypes []Type `yaml:"serverTypes"`
	URL         string `yaml:"url"`
	// resources can be multiple (user, account)
	Resources   []Resource             `yaml:"resources"`
	Metadata    map[string]interface{} `yaml:"metadata"`
	Annotations map[string]string      `yaml:"annotations"`
}

// Resource depicts the endpoints(e.g. /users, /accounts)
type Resource struct {
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}

// Type depicts the ServerType and ClientType(gRPC, REST or WS)
type Type struct {
	Config map[string]string `yaml:"config"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}
