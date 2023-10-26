package languages

import (
	"fmt"
	"github.com/intelops/compage/core/internal/core"
	corenode "github.com/intelops/compage/core/internal/core/node"
	log "github.com/sirupsen/logrus"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

const Go = "go"
const Python = "python"
const Java = "java"
const Rust = "rust"
const JavaScript = "javascript"
const TypeScript = "typescript"
const Ruby = "ruby"
const DotNet = "dotnet"

type LanguageNode struct {
	ID          string                 `json:"ID"`
	Name        string                 `json:"name"`
	NodeType    string                 `json:"nodeType"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Annotations map[string]string      `json:"annotations,omitempty"`
	Language    string                 `json:"language"`

	RestConfig *corenode.RestConfig `json:"addRestConfig"`
	GrpcConfig *corenode.GrpcConfig `json:"grpcConfig"`
	WsConfig   *corenode.WsConfig   `json:"wsConfig"`
}

// NewLanguageNode converts node to LanguageNode struct
func NewLanguageNode(compageJSON *core.CompageJSON, node *corenode.Node) (*LanguageNode, error) {
	languageNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
	}

	addRestConfig(node, languageNode)
	addGRPCConfig(node, languageNode)
	addWSConfig(node, languageNode)

	// Retrieves clients for node to other servers(other nodes). This is required for custom template plus the cli/frameworks plan for next release
	if err := PopulateClientsForNode(compageJSON, node); err != nil {
		log.Debugf("error while populating clients for node : %s", err)
		return nil, err
	}
	return languageNode, nil
}

func addWSConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.ConsumerData.WsConfig != nil {
		languageNode.WsConfig = &corenode.WsConfig{}
		languageNode.WsConfig.Template = node.ConsumerData.WsConfig.Template
		languageNode.WsConfig.Framework = node.ConsumerData.WsConfig.Framework

		// Ws clients should have client's array not nil.
		if node.ConsumerData.WsConfig.Clients != nil {
			languageNode.WsConfig.Clients = node.ConsumerData.WsConfig.Clients
		}

		// WS server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.ConsumerData.WsConfig.Server != nil && node.ConsumerData.WsConfig.Server.Port != "" {
			// one node, one ws server
			for _, resource := range node.ConsumerData.WsConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.WsConfig.Server = node.ConsumerData.WsConfig.Server
		}
	}
}

func addGRPCConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.ConsumerData.GrpcConfig != nil {
		languageNode.GrpcConfig = &corenode.GrpcConfig{}
		languageNode.GrpcConfig.Template = node.ConsumerData.GrpcConfig.Template
		languageNode.GrpcConfig.Framework = node.ConsumerData.GrpcConfig.Framework

		// gRPC clients should have client's array not nil.
		if node.ConsumerData.GrpcConfig.Clients != nil {
			languageNode.GrpcConfig.Clients = node.ConsumerData.GrpcConfig.Clients
		}

		// gRPC server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.ConsumerData.GrpcConfig.Server != nil && node.ConsumerData.GrpcConfig.Server.Port != "" {
			// one node, one grpc server
			for _, resource := range node.ConsumerData.GrpcConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.GrpcConfig.Server = node.ConsumerData.GrpcConfig.Server
		}
	}
}

func addRestConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.ConsumerData.RestConfig != nil {
		languageNode.RestConfig = &corenode.RestConfig{}
		languageNode.RestConfig.Template = node.ConsumerData.RestConfig.Template
		languageNode.RestConfig.Framework = node.ConsumerData.RestConfig.Framework
		// REST clients should have client's array not nil.
		if node.ConsumerData.RestConfig.Clients != nil {
			languageNode.RestConfig.Clients = node.ConsumerData.RestConfig.Clients
		}
		// REST server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.ConsumerData.RestConfig.Server != nil && node.ConsumerData.RestConfig.Server.Port != "" {
			// one node, one rest server
			for _, resource := range node.ConsumerData.RestConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.RestConfig.Server = node.ConsumerData.RestConfig.Server
		}
	}
}

// PopulateClientsForNode retrieves all clients for given node
func PopulateClientsForNode(compageJSON *core.CompageJSON, nodeP *corenode.Node) error {
	// REST Clients
	populateRESTClients(compageJSON, nodeP)
	// gRPC Clients
	populateGRPCClients(compageJSON, nodeP)
	// WS Clients
	err := populateWSConfig(compageJSON, nodeP)
	if err != nil {
		log.Debugf("Error while populating ws config for node %s", nodeP.ID)
		return err
	}
	return nil
}

func populateWSConfig(compageJSON *core.CompageJSON, nodeP *corenode.Node) error {
	if nodeP.ConsumerData.WsConfig != nil && nodeP.ConsumerData.WsConfig.Clients != nil {
		// iterate over the ws clients
		for _, client := range nodeP.ConsumerData.WsConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
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

func populateGRPCClients(compageJSON *core.CompageJSON, nodeP *corenode.Node) {
	if nodeP.ConsumerData.GrpcConfig != nil && nodeP.ConsumerData.GrpcConfig.Clients != nil {
		// iterate over the grpc clients
		for _, client := range nodeP.ConsumerData.GrpcConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
					client.ProtoFileContent = currentNode.ConsumerData.GrpcConfig.Server.ProtoFileContent
					client.Resources = currentNode.ConsumerData.GrpcConfig.Server.Resources
					break
				}
			}
		}
	}
}

func populateRESTClients(compageJSON *core.CompageJSON, nodeP *corenode.Node) {
	if nodeP.ConsumerData.RestConfig != nil && nodeP.ConsumerData.RestConfig.Clients != nil {
		// iterate over the rest clients
		for _, client := range nodeP.ConsumerData.RestConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
					client.OpenAPIFileYamlContent = currentNode.ConsumerData.RestConfig.Server.OpenAPIFileYamlContent
					client.Resources = currentNode.ConsumerData.RestConfig.Server.Resources
					break
				}
			}
		}
	}
}

//nolint:golint,unused
func getProtoFileContentAndFrameworkFromNodeForEdge(src string, nodes []*corenode.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.GrpcConfig.Server.ProtoFileContent, n.ConsumerData.GrpcConfig.Framework
		}
	}
	return "", ""
}

func GetOpenAPIFileYamlContentAndFrameworkAndTemplateFromNodeForEdge(src string, nodes []*corenode.Node) (string, string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.RestConfig.Server.OpenAPIFileYamlContent, n.ConsumerData.RestConfig.Framework, n.ConsumerData.RestConfig.Template
		}
	}
	return "", "", ""
}
