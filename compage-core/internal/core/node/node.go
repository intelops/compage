package node

import "github.com/kube-tarian/compage-core/internal/core"

// ConsumerData has detailed attributes of a Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	Template string `yaml:"template"`
	// Name of component (required, this will be service and deployment name)
	Name        string      `yaml:"name"`
	NodeType    string      `yaml:"nodeType"`
	ServerTypes []core.Type `yaml:"serverTypes"`
	URL         string      `yaml:"url"`
	// resources can be multiple (user, account)
	Resources   []core.Resource        `yaml:"resources"`
	Metadata    map[string]interface{} `yaml:"metadata"`
	Annotations map[string]string      `yaml:"annotations"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}
