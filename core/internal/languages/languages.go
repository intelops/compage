package languages

import (
	"fmt"
	"github.com/kube-tarian/compage/core/internal/core"
	"github.com/kube-tarian/compage/core/internal/core/edge"
	"github.com/kube-tarian/compage/core/internal/core/node"
)

const Go = "Golang"
const NodeJs = "NodeJs"
const Compage string = "compage"

type LanguageNode struct {
	ID          string                 `json:"ID"`
	Name        string                 `json:"name"`
	NodeType    string                 `json:"nodeType"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Annotations map[string]string      `json:"annotations,omitempty"`
	Language    string                 `json:"language"`
	Template    string                 `json:"template"`

	RestConfig *RestConfig `json:"restConfig"`
	GrpcConfig *GrpcConfig `json:"grpcConfig"`
	WsConfig   *WsConfig   `json:"wsConfig"`
	DBConfig   *DBConfig   `json:"dbConfig"`
}

// RestServer holds information about the node's REST server.
type RestServer struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

// RestClient holds information about edge between nodeA and nodeB.
type RestClient struct {
	Protocol     string `json:"protocol"`
	Port         string `json:"port"`
	Framework    string `json:"framework"`
	ExternalNode string `json:"externalNode"`
}

// RestConfig rest configs
type RestConfig struct {
	Server  *RestServer  `json:"server"`
	Clients []RestClient `json:"clients"`
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

// DBConfig holds information about db for a node
type DBConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Address   string          `json:"address"`
	Type      string          `json:"type"`
	Resources []node.Resource `json:"resources"`
}

// Clients all clients - generic (REST/GRPC/WS)
type Clients map[string]interface{}

// Servers all servers - generic (REST/GRPC/WS)
type Servers map[string]interface{}

// NewLanguageNode converts node to LanguageNode struct
func NewLanguageNode(compageJson *core.CompageJson, node *node.Node) (*LanguageNode, error) {
	goNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
		Template:    node.ConsumerData.Template,
	}

	servers, err := GetServersForNode(node)
	if err != nil {
		return nil, err
	}

	// This will be used to create clients to other servers. This is required for custom template plus the, cli/frameworks plan for next release
	clients, err := GetClientsForNode(compageJson.Edges, node)
	if err != nil {
		return nil, err
	}
	// check if the servers has rest entry (if node is not server or node is not REST server)
	if restServer, ok := (*servers)[core.Rest]; ok {
		// one node, one rest server
		goNode.RestConfig = &RestConfig{
			Server: restServer.(*RestServer),
		}
	}
	// check if any rest client needs to be created
	if restClients, ok := (*clients)[core.Rest]; ok {
		// if the component is just client and not server, goNode.RestConfig will be nil in that case.
		if goNode.RestConfig == nil {
			goNode.RestConfig = &RestConfig{
				Clients: restClients.([]RestClient),
			}
		} else {
			goNode.RestConfig.Clients = restClients.([]RestClient)
		}
		// set framework to all clients for this node as it's set for server.
		for _, client := range goNode.RestConfig.Clients {
			// if server is nil, assign default framework i.e. http client
			if goNode.RestConfig.Server != nil {
				client.Framework = goNode.RestConfig.Server.Framework
			} else {
				// default rest client code based on below framework.
				client.Framework = "net/http"
			}
		}
	}

	return goNode, nil
}

// GetServersForNode retrieves all servers for given node
func GetServersForNode(nodeP *node.Node) (*Servers, error) {
	servers := &Servers{}
	// check if the node is server
	if nodeP.ConsumerData.ServerTypes != nil {
		// retrieve Rest server config and store in below variable
		var restServer *RestServer
		// iterate over the serverTypes. Protocol in serverType decides server's type.
		for _, serverType := range nodeP.ConsumerData.ServerTypes {
			serverProtocol := serverType.Protocol
			if serverProtocol == core.Rest {
				restServer = &RestServer{
					Framework: serverType.Framework,
					Port:      serverType.Port,
					Resources: serverType.Resources,
				}
				(*servers)[core.Rest] = restServer
				return servers, nil
			} else if serverProtocol == core.Grpc {
				return nil, fmt.Errorf("unsupported serverProtocol %s for language : %s", serverProtocol,
					nodeP.ConsumerData.Language)
			} else if serverProtocol == core.Ws {
				return nil, fmt.Errorf("unsupported serverProtocol %s for language : %s", serverProtocol,
					nodeP.ConsumerData.Language)
			}
		}
	}
	// empty servers as no server config received in compageJson.
	return servers, nil
}

// GetClientsForNode retrieves all clients for given node
func GetClientsForNode(edges []*edge.Edge, nodeP *node.Node) (*Clients, error) {
	var restClients []RestClient
	for _, e := range edges {
		// if the current node is in dest field of edge, it means it's a client to node in src field of edge.
		if e.Dest == nodeP.ID {
			for _, clientType := range e.ConsumerData.ClientTypes {
				if clientType.Protocol == core.Rest {
					restClients = append(restClients, RestClient{
						Protocol: clientType.Protocol,
						Port:     clientType.Port,
						// TODO refer node's name here instead of id.
						ExternalNode: e.ConsumerData.ExternalNodeName,
					})
					// only one rest client config for a given edge.
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
	clients := &Clients{}
	// if there are any rest clients return them
	if len(restClients) > 0 {
		(*clients)[core.Rest] = restClients
	}
	return clients, nil
}
