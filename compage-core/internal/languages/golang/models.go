package golang

import (
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
)

const (
	Compage string = "compage"
)

type GoNode struct {
	ID          string                 `json:"ID"`
	Name        string                 `json:"name"`
	NodeType    string                 `json:"nodeType"`
	Metadata    map[string]interface{} `yaml:"metadata,omitempty"`
	Annotations map[string]string      `yaml:"annotations,omitempty"`
	Language    string                 `yaml:"language"`
	Template    string                 `yaml:"template"`

	RestConfig *languages.RestConfig `json:"restConfig"`
	GrpcConfig *languages.GrpcConfig `json:"grpcConfig"`
	WsConfig   *languages.WsConfig   `json:"wsConfig"`
	DBConfig   *languages.DBConfig   `json:"dbConfig"`
}

// NewNode converts node to GoNode struct
func NewNode(node node.Node, servers *languages.Servers, clients *languages.Clients) (*GoNode, error) {
	goNode := &GoNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		NodeType:    node.ConsumerData.NodeType,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
		Template:    node.ConsumerData.Template,
	}

	if restServer, ok := (*servers)[core.Rest]; ok {
		goNode.RestConfig = &languages.RestConfig{
			Server: restServer.(*languages.RestServer),
		}
	}

	if restClients, ok := (*clients)[core.Rest]; ok {
		if goNode.RestConfig == nil {
			goNode.RestConfig = &languages.RestConfig{
				Clients: restClients.([]languages.RestClient),
			}
		} else {
			goNode.RestConfig.Clients = restClients.([]languages.RestClient)
		}
		// set framework to clients as its there for server
		for _, client := range goNode.RestConfig.Clients {
			client.Framework = goNode.RestConfig.Server.Framework
		}
	}

	err := goNode.fillDefaults()
	if err != nil {
		return nil, err
	}

	return goNode, nil
}

// constructor function
func (goNode *GoNode) fillDefaults() error {
	// setting default values if no values present
	if goNode.RestConfig == nil {
		goNode.RestConfig = &languages.RestConfig{
			Server: &languages.RestServer{
				Framework: "gin",
				Port:      "8888",
				Resources: []node.Resource{
					{
						Name:   "user",
						Fields: map[string]string{"name": "string"},
					},
				},
			},
		}
	}
	if goNode.GrpcConfig == nil {
		goNode.GrpcConfig = &languages.GrpcConfig{
			Framework: "grpcCore",
			Port:      "50051",
			Resources: []node.Resource{
				{
					Name:   "user",
					Fields: map[string]string{"name": "string"},
				},
			},
		}
	}
	if goNode.WsConfig == nil {
		goNode.WsConfig = &languages.WsConfig{
			Framework: "Stomp",
			Port:      "9000",
			Resources: []node.Resource{
				{
					Name:   "user",
					Fields: map[string]string{"name": "string"},
				},
			},
		}
	}
	if goNode.DBConfig == nil {
		goNode.DBConfig = &languages.DBConfig{
			Framework: "gorm",
			Port:      "3306",
			Type:      "mysql",
			Address:   "localhost",
		}
	}

	// set client details to node

	if goNode.Language == "" {
		goNode.Language = languages.Go
	}
	if goNode.Template == "" {
		goNode.Template = Compage
	}

	return nil
}
