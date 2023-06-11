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

	RestConfig *core_node.RestConfig `json:"restConfig"`
	GrpcConfig *core_node.GrpcConfig `json:"grpcConfig"`
	WsConfig   *core_node.WsConfig   `json:"wsConfig"`
}

// NewLanguageNode converts node to LanguageNode struct
func NewLanguageNode(compageJSON *core.CompageJSON, node *core_node.Node) (*LanguageNode, error) {
	languageNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
	}

	if node.ConsumerData.RestConfig != nil {
		languageNode.RestConfig = &core_node.RestConfig{}
		languageNode.RestConfig.Template = node.ConsumerData.RestConfig.Template
	}
	if node.ConsumerData.GrpcConfig != nil {
		languageNode.GrpcConfig = &core_node.GrpcConfig{}
		languageNode.GrpcConfig.Template = node.ConsumerData.GrpcConfig.Template
	}
	if node.ConsumerData.WsConfig != nil {
		languageNode.WsConfig = &core_node.WsConfig{}
		languageNode.WsConfig.Template = node.ConsumerData.WsConfig.Template
	}

	// REST server should have port and if port is nil.
	if node.ConsumerData.RestConfig != nil && node.ConsumerData.RestConfig.Server != nil && node.ConsumerData.RestConfig.Server.Port != "" {
		// one node, one rest server
		languageNode.RestConfig.Server = node.ConsumerData.RestConfig.Server
	}

	// REST clients should have client's array not nil.
	if node.ConsumerData.RestConfig != nil && node.ConsumerData.RestConfig.Clients != nil {
		languageNode.RestConfig.Clients = node.ConsumerData.RestConfig.Clients
	}

	// gRPC server should have port and if port is nil.
	if node.ConsumerData.GrpcConfig != nil && node.ConsumerData.GrpcConfig.Server != nil && node.ConsumerData.GrpcConfig.Server.Port != "" {
		// one node, one grpc server
		languageNode.GrpcConfig.Server = node.ConsumerData.GrpcConfig.Server
	}

	// gRPC clients should have client's array not nil.
	if node.ConsumerData.GrpcConfig != nil && node.ConsumerData.GrpcConfig.Clients != nil {
		languageNode.GrpcConfig.Clients = node.ConsumerData.GrpcConfig.Clients
	}

	// WS server should have port and if port is nil, that means the node is not server, but it's a client.
	if node.ConsumerData.WsConfig != nil && node.ConsumerData.WsConfig.Server != nil && node.ConsumerData.WsConfig.Server.Port != "" {
		// one node, one ws server
		languageNode.WsConfig.Server = node.ConsumerData.WsConfig.Server
	}

	// Ws clients should have client's array not nil.
	if node.ConsumerData.WsConfig != nil && node.ConsumerData.WsConfig.Clients != nil {
		languageNode.WsConfig.Clients = node.ConsumerData.WsConfig.Clients
	}

	// Retrieves clients for node to other servers(other nodes). This is required for custom template plus the cli/frameworks plan for next release
	if err := PopulateClientsForNode(compageJSON, node); err != nil {
		return nil, err
	}
	return languageNode, nil
}

// PopulateClientsForNode retrieves all clients for given node
func PopulateClientsForNode(compageJSON *core.CompageJSON, nodeP *core_node.Node) error {
	// REST Clients
	if nodeP.ConsumerData.RestConfig != nil && nodeP.ConsumerData.RestConfig.Clients != nil {
		// iterate over the rest clients
		for _, client := range nodeP.ConsumerData.RestConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeId == currentNode.ID {
					client.OpenAPIFileYamlContent = currentNode.ConsumerData.RestConfig.Server.OpenAPIFileYamlContent
					client.Resources = currentNode.ConsumerData.RestConfig.Server.Resources
					break
				}
			}
		}
	}
	// gRPC Clients
	if nodeP.ConsumerData.GrpcConfig != nil && nodeP.ConsumerData.GrpcConfig.Clients != nil {
		// iterate over the grpc clients
		for _, client := range nodeP.ConsumerData.GrpcConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeId == currentNode.ID {
					client.ProtoFileContent = currentNode.ConsumerData.GrpcConfig.Server.ProtoFileContent
					client.Resources = currentNode.ConsumerData.GrpcConfig.Server.Resources
					break
				}
			}
		}
	} // WS Clients
	if nodeP.ConsumerData.WsConfig != nil && nodeP.ConsumerData.WsConfig.Clients != nil {
		// iterate over the ws clients
		for _, client := range nodeP.ConsumerData.WsConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeId == currentNode.ID {
					client.Resources = currentNode.ConsumerData.WsConfig.Server.Resources
					break
				}
			}
		}
		return fmt.Errorf("unsupported clientProtocol %s for language : %s",
			"ws", nodeP.ConsumerData.Language)
	}
	return nil
}

//nolint:golint,unused
func getProtoFileContentAndFrameworkFromNodeForEdge(src string, nodes []*core_node.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.GrpcConfig.Server.ProtoFileContent, n.ConsumerData.GrpcConfig.Server.Framework
		}
	}
	return "", ""
}

func getOpenAPIFileYamlContentAndFrameworkAndTemplateFromNodeForEdge(src string, nodes []*core_node.Node) (string, string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.RestConfig.Server.OpenAPIFileYamlContent, n.ConsumerData.RestConfig.Server.Framework, n.ConsumerData.RestConfig.Template
		}
	}
	return "", "", ""
}
