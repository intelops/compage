package languages

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/core/edge"
	"github.com/kube-tarian/compage-core/internal/core/node"
)

const Go = "Golang"
const NodeJs = "NodeJs"

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
			return nil, errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol,
				nodeP.ConsumerData.Language))
		} else if serverProtocol == core.Ws {
			return nil, errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol,
				nodeP.ConsumerData.Language))
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
					return nil, errors.New(fmt.Sprintf("unsupported clientProtocol %s for language : %s",
						clientType.Protocol, nodeP.ConsumerData.Language))
				} else if clientType.Protocol == core.Ws {
					return nil, errors.New(fmt.Sprintf("unsupported clientProtocol %s for language : %s",
						clientType.Protocol, nodeP.ConsumerData.Language))
				}
			}
		}
	}

	return &Clients{
		core.Rest: restClients,
	}, nil
}
