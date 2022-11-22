package golang

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/edge"
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

	RestConfig *RestConfig `json:"restConfig"`
	GrpcConfig *GrpcConfig `json:"grpcConfig"`
	WsConfig   *WsConfig   `json:"wsConfig"`
	DBConfig   *DBConfig   `json:"dbConfig"`
}

type DBConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Address   string          `json:"address"`
	Type      string          `json:"type"`
	Resources []node.Resource `json:"resources"`
}

// RestConfig rest configs
type RestConfig struct {
	Server  *RestServer  `json:"server"`
	Clients []RestClient `json:"clients"`
}

type RestServer struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

type RestClient struct {
	Protocol     string `json:"protocol"`
	Port         string `json:"port"`
	Framework    string `json:"framework"`
	ExternalNode string `json:"externalNode"`
}

// GrpcConfig grpc configs
type GrpcConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

// WsConfig ws configs
type WsConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

// all clients
type clients map[string]interface{}

// all servers
type servers map[string]interface{}

// NewNode converts node to GoNode struct
func NewNode(compageYaml *core.CompageYaml, node node.Node) (*GoNode, error) {
	// This will be used to create clients to other servers. This is required for custom template plus the
	// cli/frameworks plan for next release
	clients, err := getClientsForNode(compageYaml.Edges, node)
	if err != nil {
		return nil, err
	}

	servers, err := getServersForNode(node)
	if err != nil {
		return nil, err
	}

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
		goNode.RestConfig = &RestConfig{
			Server: restServer.(*RestServer),
		}
	}

	if restClients, ok := (*clients)[core.Rest]; ok {
		if goNode.RestConfig == nil {
			goNode.RestConfig = &RestConfig{
				Clients: restClients.([]RestClient),
			}
		} else {
			goNode.RestConfig.Clients = restClients.([]RestClient)
		}
	}

	err = goNode.fillDefaults()
	if err != nil {
		return nil, err
	}

	return goNode, nil
}

// constructor function
func (goNode *GoNode) fillDefaults() error {
	// setting default values if no values present
	if goNode.RestConfig == nil {
		goNode.RestConfig = &RestConfig{
			Server: &RestServer{
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
		goNode.GrpcConfig = &GrpcConfig{
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
		goNode.WsConfig = &WsConfig{
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
		goNode.DBConfig = &DBConfig{
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

func getServersForNode(nodeP node.Node) (*servers, error) {
	var restServer *RestServer
	for _, serverType := range nodeP.ConsumerData.ServerTypes {
		serverProtocol := serverType.Protocol
		if serverProtocol == core.Rest {
			restServer = &RestServer{
				Framework: serverType.Framework,
				Port:      serverType.Port,
				Resources: serverType.Resources,
			}
		} else if serverProtocol == core.Grpc {
			return nil, errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol, languages.Go))
		} else if serverProtocol == core.Ws {
			return nil, errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol, languages.Go))
		}
	}
	return &servers{
		core.Rest: restServer,
	}, nil
}

func getClientsForNode(edges []edge.Edge, node node.Node) (*clients, error) {
	var restClients []RestClient

	for _, e := range edges {
		if e.Dest == node.ID {
			for _, clientType := range e.ConsumerData.ClientTypes {
				if clientType.Protocol == core.Rest {
					restClients = append(restClients, RestClient{
						Protocol:     clientType.Protocol,
						Port:         clientType.Port,
						Framework:    "",
						ExternalNode: e.Src,
					})

					// only one rest client config for a given edge
					break
				} else if clientType.Protocol == core.Grpc {
					return nil, errors.New(fmt.Sprintf("unsupported clientProtocol %s for language : %s", clientType.Protocol, languages.Go))
				} else if clientType.Protocol == core.Ws {
					return nil, errors.New(fmt.Sprintf("unsupported clientProtocol %s for language : %s", clientType.Protocol, languages.Go))
				}
			}
		}
	}

	return &clients{
		core.Rest: restClients,
	}, nil
}
