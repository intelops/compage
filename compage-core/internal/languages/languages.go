package languages

import (
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/edge"
	"github.com/kube-tarian/compage-core/internal/core/node"
)

const Go = "Golang"
const NodeJs = "NodeJs"
const Compage string = "compage"

type LanguageNode struct {
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

type RestServer struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

// RestConfig rest configs
type RestConfig struct {
	Server  *RestServer  `json:"server"`
	Clients []RestClient `json:"clients"`
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

// Clients all clients
type Clients map[string]interface{}

// Servers all servers
type Servers map[string]interface{}

// NewLanguageNode converts node to LanguageNode struct
func NewLanguageNode(compageYaml *core.CompageYaml, node node.Node) (*LanguageNode, error) {
	goNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		NodeType:    node.ConsumerData.NodeType,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
		Template:    node.ConsumerData.Template,
	}

	servers, err := GetServersForNode(node)
	if err != nil {
		return nil, err
	}
	// This will be used to create clients to other servers. This is required for custom template plus the
	// cli/frameworks plan for next release
	clients, err := GetClientsForNode(compageYaml.Edges, node)
	if err != nil {
		return nil, err
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
		// set framework to clients as its there for server
		for _, client := range goNode.RestConfig.Clients {
			client.Framework = goNode.RestConfig.Server.Framework
		}
	}

	return goNode, nil
}

// GetServersForNode retrieves all servers for given node
func GetServersForNode(nodeP node.Node) (*Servers, error) {
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
			return nil, fmt.Errorf("unsupported serverProtocol %s for language : %s", serverProtocol,
				nodeP.ConsumerData.Language)
		} else if serverProtocol == core.Ws {
			return nil, fmt.Errorf("unsupported serverProtocol %s for language : %s", serverProtocol,
				nodeP.ConsumerData.Language)
		}
	}
	return &Servers{
		core.Rest: restServer,
	}, nil
}

// GetClientsForNode retrieves all clients for given node
func GetClientsForNode(edges []edge.Edge, nodeP node.Node) (*Clients, error) {
	var restClients []RestClient
	for _, e := range edges {
		if e.Dest == nodeP.ID {
			for _, clientType := range e.ConsumerData.ClientTypes {
				if clientType.Protocol == core.Rest {
					restClients = append(restClients, RestClient{
						Protocol:     clientType.Protocol,
						Port:         clientType.Port,
						ExternalNode: e.Src,
					})
					// only one rest client config for a given edge
					break
				} else if clientType.Protocol == core.Grpc {
					return nil, fmt.Errorf("unsupported clientProtocol %s for language : %s",
						clientType.Protocol, nodeP.ConsumerData.Language)
				} else if clientType.Protocol == core.Ws {
					return nil, fmt.Errorf("unsupported clientProtocol %s for language : %s",
						clientType.Protocol, nodeP.ConsumerData.Language)
				}
			}
		}
	}

	return &Clients{
		core.Rest: restClients,
	}, nil
}
