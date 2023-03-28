package languages

import (
	"fmt"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/core/node"
)

const Go = "go"
const Compage string = "compage"
const OpenApi string = "openApi"

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
	// OpenApiFileYamlContent holds openApiFileYamlContent
	OpenApiFileYamlContent string `json:"openApiFileYamlContent,omitempty"`
}

// RestClient holds information about edge between nodeA and nodeB.
type RestClient struct {
	Port         string `json:"port"`
	Framework    string `json:"framework"`
	ExternalNode string `json:"externalNode"`
	// OpenApiFileYamlContent holds openApiFileYamlContent
	OpenApiFileYamlContent string `json:"openApiFileYamlContent,omitempty"`
}

// GrpcServer holds information about the node's grpc server.
type GrpcServer struct {
	Port      string          `json:"port"`
	Framework string          `json:"framework"`
	Resources []node.Resource `json:"resources"`
	// ProtoFileContent holds protoFileContent
	ProtoFileContent string `json:"protoFileContent,omitempty"`
}

// GrpcClient holds information about edge between nodeA and nodeB.
type GrpcClient struct {
	Port         string `json:"port"`
	Framework    string `json:"framework"`
	ExternalNode string `json:"externalNode"`
	// ProtoFileContent holds protoFileContent
	ProtoFileContent string `json:"protoFileContent,omitempty"`
}

// WsServer holds information about the node's ws server.
type WsServer struct {
	Port      string          `json:"port"`
	Framework string          `json:"framework"`
	Resources []node.Resource `json:"resources"`
}

// WsClient holds information about edge between nodeA and nodeB.
type WsClient struct {
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
	Server  *GrpcServer  `json:"server"`
	Clients []GrpcClient `json:"clients"`
}

// WsConfig ws configs
type WsConfig struct {
	Server  *WsServer  `json:"server"`
	Clients []WsClient `json:"clients"`
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
	languageNode := &LanguageNode{
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

	// Retrieves clients for node to other servers(other nodes). This is required for custom template plus the cli/frameworks plan for next release
	clients, err := GetClientsForNode(compageJson, node)
	if err != nil {
		return nil, err
	}

	// check if the servers has rest entry (if node is not server or node is not REST server)
	if restServer, ok := (*servers)[core.Rest]; ok {
		// one node, one rest server
		languageNode.RestConfig = &RestConfig{
			Server: restServer.(*RestServer),
		}
	}

	// check if any rest client needs to be created
	if restClients, ok := (*clients)[core.Rest]; ok {
		// if the component is just client and not server, languageNode.RestConfig will be nil in that case.
		if languageNode.RestConfig == nil {
			languageNode.RestConfig = &RestConfig{
				Clients: restClients.([]RestClient),
			}
		} else {
			languageNode.RestConfig.Clients = restClients.([]RestClient)
		}

		// set framework to all clients for this node as it's set for server.
		for _, client := range languageNode.RestConfig.Clients {
			// if server is nil, assign default framework i.e. http client
			if languageNode.RestConfig.Server != nil {
				client.Framework = languageNode.RestConfig.Server.Framework
			} else {
				// default rest client code based on below framework.
				client.Framework = "go-gin-server"
			}
		}
	}

	return languageNode, nil
}

// GetServersForNode retrieves all servers for given node
func GetServersForNode(nodeP *node.Node) (*Servers, error) {
	servers := &Servers{}
	// check if the node is REST server
	if nodeP.ConsumerData.RestServerConfig != nil {
		// retrieve Rest server config and store in below variable
		var restServer *RestServer
		restServer = &RestServer{
			Framework: nodeP.ConsumerData.RestServerConfig.Framework,
			Port:      nodeP.ConsumerData.RestServerConfig.Port,
		}
		// set resources or openApiFileYamlContent based on availability.
		if nodeP.ConsumerData.RestServerConfig.Resources != nil && len(nodeP.ConsumerData.RestServerConfig.Resources) > 0 {
			restServer.Resources = nodeP.ConsumerData.RestServerConfig.Resources
		} else if len(nodeP.ConsumerData.RestServerConfig.OpenApiFileYamlContent) > 0 {
			restServer.OpenApiFileYamlContent = nodeP.ConsumerData.RestServerConfig.OpenApiFileYamlContent
		}
		(*servers)[core.Rest] = restServer
	}
	if nodeP.ConsumerData.GrpcServerConfig != nil {
		// catch gRPC server details here
		// TODO
	}
	if nodeP.ConsumerData.WsServerConfig != nil {
		// catch Ws server details here
		// TODO
	}
	// empty servers as no server config received in compageJson.
	return servers, nil
}

// GetClientsForNode retrieves all clients for given node
func GetClientsForNode(compageJson *core.CompageJson, nodeP *node.Node) (*Clients, error) {
	var restClients []RestClient
	var grpcClients []GrpcClient
	var wsClients []WsClient

	for _, e := range compageJson.Edges {
		// if the current node is in dest field of edge, it means it's a client to node in src field of edge.
		if e.Dest == nodeP.ID {
			if e.ConsumerData.RestClientConfig != nil {
				openApiFileYamlContent, framework := getOpenApiFileYamlContentAndFrameworkFromNodeForEdge(e.Src, compageJson.Nodes)

				restClients = append(restClients, RestClient{
					Port: e.ConsumerData.RestClientConfig.Port,
					// TODO refer node's name here instead of id. This is required for service-name generation. Need to re-check.
					ExternalNode:           e.Src,
					Framework:              framework,
					OpenApiFileYamlContent: openApiFileYamlContent,
				})
			}
			if e.ConsumerData.GrpcClientConfig != nil {
				protoFileContent, framework := getProtoFileContentAndFrameworkFromNodeForEdge(e.Src, compageJson.Nodes)
				grpcClients = append(grpcClients, GrpcClient{
					Port: e.ConsumerData.RestClientConfig.Port,
					// TODO refer node's name here instead of id. This is required for service-name generation. Need to re-check.
					ExternalNode:     e.Src,
					Framework:        framework,
					ProtoFileContent: protoFileContent,
				})
				return nil, fmt.Errorf("unsupported clientProtocol %s for language : %s",
					"grpc", nodeP.ConsumerData.Language)
			}
			if e.ConsumerData.WsClientConfig != nil {
				wsClients = append(wsClients, WsClient{
					Port: e.ConsumerData.RestClientConfig.Port,
					// TODO refer node's name here instead of id. This is required for service-name generation. Need to re-check.
					ExternalNode: e.Src,
				})
				return nil, fmt.Errorf("unsupported clientProtocol %s for language : %s",
					"ws", nodeP.ConsumerData.Language)
			}
		}
	}
	clients := &Clients{}
	// if there are any rest clients return them
	if len(restClients) > 0 {
		(*clients)[core.Rest] = restClients
	}
	// if there are any grpc clients return them
	if len(grpcClients) > 0 {
		(*clients)[core.Grpc] = grpcClients
	}
	// if there are any ws clients return them
	if len(wsClients) > 0 {
		(*clients)[core.Ws] = wsClients
	}
	return clients, nil
}

func getProtoFileContentAndFrameworkFromNodeForEdge(src string, nodes []*node.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.GrpcServerConfig.ProtoFileContent, n.ConsumerData.GrpcServerConfig.Framework
		}
	}
	return "", ""
}

func getOpenApiFileYamlContentAndFrameworkFromNodeForEdge(src string, nodes []*node.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.RestServerConfig.OpenApiFileYamlContent, n.ConsumerData.RestServerConfig.Framework
		}
	}
	return "", ""
}
