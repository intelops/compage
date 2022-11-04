package node

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	// Name of component
	Name     string `yaml:"name"`
	NodeType string `yaml:"nodeType"`
	// TODO do we really need this, if yes whats its use? (Remove from edge too)
	Type string `yaml:"type"`
	URL  string `yaml:"url"`
	// resources can be multiple (user, account)
	Resources []Resource `yaml:"resources"`
}

// Resource depicts the endpoint(e.g. /user, /account)
type Resource struct {
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}
