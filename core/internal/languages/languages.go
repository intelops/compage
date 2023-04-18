package languages

import (
	"fmt"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/core/node"
)

const Go = "go"
const Python = "python"
const Java = "java"
const Rust = "rust"
const JavaScript = "javascript"
const TypeScript = "typescript"
const Ruby = "ruby"

type LanguageNode struct {
	ID          string                 `json:"ID"`
	Name        string                 `json:"name"`
	NodeType    string                 `json:"nodeType"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Annotations map[string]string      `json:"annotations,omitempty"`
	Language    string                 `json:"language"`

	RestConfig *RestConfig `json:"restConfig"`
	GrpcConfig *GrpcConfig `json:"grpcConfig"`
	WsConfig   *WsConfig   `json:"wsConfig"`
	DBConfig   *DBConfig   `json:"dbConfig"`
}

// RestServer holds information about the node's REST server.
type RestServer struct {
	Template  string          `json:"template"`
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
	// OpenAPIFileYamlContent holds openAPIFileYamlContent
	OpenAPIFileYamlContent string `json:"openAPIFileYamlContent,omitempty"`
}

// RestClient holds information about edge between nodeA and nodeB.
type RestClient struct {
	Port         string `json:"port"`
	Template     string `json:"template"`
	Framework    string `json:"framework"`
	ExternalNode string `json:"externalNode"`
	// OpenAPIFileYamlContent holds openAPIFileYamlContent
	OpenAPIFileYamlContent string `json:"openAPIFileYamlContent,omitempty"`
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
func NewLanguageNode(compageJSON *core.CompageJSON, node *node.Node) (*LanguageNode, error) {
	languageNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
	}

	servers, err := GetServersForNode(node)
	if err != nil {
		return nil, err
	}

	// Retrieves clients for node to other servers(other nodes). This is required for custom template plus the cli/frameworks plan for next release
	clients, err := GetClientsForNode(compageJSON, node)
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
	}

	return languageNode, nil
}

// GetServersForNode retrieves all servers for given node
func GetServersForNode(nodeP *node.Node) (*Servers, error) {
	servers := &Servers{}
	// check if the node is REST server
	if nodeP.ConsumerData.RestServerConfig != nil {
		// retrieve Rest server config and store in below variable
		restServer := &RestServer{
			Template:  nodeP.ConsumerData.RestServerConfig.Template,
			Framework: nodeP.ConsumerData.RestServerConfig.Framework,
			Port:      nodeP.ConsumerData.RestServerConfig.Port,
		}
		// set resources or openAPIFileYamlContent based on availability.
		if nodeP.ConsumerData.RestServerConfig.Resources != nil && len(nodeP.ConsumerData.RestServerConfig.Resources) > 0 {
			restServer.Resources = nodeP.ConsumerData.RestServerConfig.Resources
		} else if len(nodeP.ConsumerData.RestServerConfig.OpenAPIFileYamlContent) > 0 {
			restServer.OpenAPIFileYamlContent = nodeP.ConsumerData.RestServerConfig.OpenAPIFileYamlContent
		}
		(*servers)[core.Rest] = restServer
	}
	if nodeP.ConsumerData.GrpcServerConfig != nil { //nolint:golint,staticcheck
		// catch gRPC server details here
		// TODO
	}
	if nodeP.ConsumerData.WsServerConfig != nil { //nolint:golint,staticcheck
		// catch Ws server details here
		// TODO
	}
	// empty servers as no server config received in compageJSON.
	return servers, nil
}

// GetClientsForNode retrieves all clients for given node
func GetClientsForNode(compageJSON *core.CompageJSON, nodeP *node.Node) (*Clients, error) {
	var restClients []RestClient
	var grpcClients []GrpcClient
	var wsClients []WsClient

	for _, e := range compageJSON.Edges {
		// if the current node is in dest field of edge, it means it's a client to node in src field of edge.
		if e.Dest == nodeP.ID {
			if e.ConsumerData.RestClientConfig != nil {
				// extract information from edge's source node.
				openAPIFileYamlContent, framework, template := getOpenAPIFileYamlContentAndFrameworkAndTemplateFromNodeForEdge(e.Src, compageJSON.Nodes)
				restClients = append(restClients, RestClient{
					Port:                   e.ConsumerData.RestClientConfig.Port,
					ExternalNode:           e.ConsumerData.ExternalNode,
					Framework:              framework,
					OpenAPIFileYamlContent: openAPIFileYamlContent,
					Template:               template,
				})
			}
			if e.ConsumerData.GrpcClientConfig != nil {
				//protoFileContent, framework := getProtoFileContentAndFrameworkFromNodeForEdge(e.Src, compageJSON.Nodes)
				//grpcClients = append(grpcClients, GrpcClient{
				//	Port:             e.ConsumerData.RestClientConfig.Port,
				//	ExternalNode:     e.ConsumerData.ExternalNode,
				//	Framework:        framework,
				//	ProtoFileContent: protoFileContent,
				//})
				return nil, fmt.Errorf("unsupported clientProtocol %s for language : %s",
					"grpc", nodeP.ConsumerData.Language)
			}
			if e.ConsumerData.WsClientConfig != nil {
				//wsClients = append(wsClients, WsClient{
				//	Port:         e.ConsumerData.RestClientConfig.Port,
				//	ExternalNode: e.ConsumerData.ExternalNode,
				//})
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

//nolint:golint,unused
func getProtoFileContentAndFrameworkFromNodeForEdge(src string, nodes []*node.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.GrpcServerConfig.ProtoFileContent, n.ConsumerData.GrpcServerConfig.Framework
		}
	}
	return "", ""
}

func getOpenAPIFileYamlContentAndFrameworkAndTemplateFromNodeForEdge(src string, nodes []*node.Node) (string, string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.RestServerConfig.OpenAPIFileYamlContent, n.ConsumerData.RestServerConfig.Framework, n.ConsumerData.RestServerConfig.Template
		}
	}
	return "", "", ""
}
