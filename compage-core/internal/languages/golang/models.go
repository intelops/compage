package golang

import (
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
)

// GoNode language specific struct.
type GoNode struct {
	languages.LanguageNode
}

// FillDefaults constructor function
func (goNode *GoNode) FillDefaults() error {
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
		goNode.Template = languages.Compage
	}

	return nil
}
