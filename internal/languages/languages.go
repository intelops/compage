package languages

import (
	"fmt"
	"github.com/intelops/compage/internal/core"
	corenode "github.com/intelops/compage/internal/core/node"
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
	License     *corenode.License      `json:"license"`
	RestConfig  *corenode.RestConfig   `json:"addRestConfig"`
	GrpcConfig  *corenode.GrpcConfig   `json:"grpcConfig"`
	WsConfig    *corenode.WsConfig     `json:"wsConfig"`
}

// NewLanguageNode converts node to LanguageNode struct
func NewLanguageNode(compageJSON *core.CompageJSON, node *corenode.Node) (*LanguageNode, error) {
	languageNode := &LanguageNode{
		ID:          node.ID,
		Name:        node.Name,
		Metadata:    node.Metadata,
		Annotations: node.Annotations,
		Language:    node.Language,
	}

	addRestConfig(node, languageNode)
	addGRPCConfig(node, languageNode)
	addWSConfig(node, languageNode)

	// Retrieves clients for node to other servers(other nodes). This is required for custom template plus the cli/frameworks plan for next release
	if err := PopulateClientsForNode(compageJSON, node); err != nil {
		log.Errorf("error while populating clients for node : %s", err)
		return nil, err
	}
	return languageNode, nil
}

func addWSConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.WsConfig != nil {
		languageNode.WsConfig = &corenode.WsConfig{}
		languageNode.WsConfig.Template = node.WsConfig.Template
		languageNode.WsConfig.Framework = node.WsConfig.Framework

		// Ws clients should have client's array not nil.
		if node.WsConfig.Clients != nil {
			languageNode.WsConfig.Clients = node.WsConfig.Clients
		}

		// WS server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.WsConfig.Server != nil && node.WsConfig.Server.Port != "" {
			// one node, one ws server
			for _, resource := range node.WsConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.WsConfig.Server = node.WsConfig.Server
		}
	}
}

func addGRPCConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.GrpcConfig != nil {
		languageNode.GrpcConfig = &corenode.GrpcConfig{}
		languageNode.GrpcConfig.Template = node.GrpcConfig.Template
		languageNode.GrpcConfig.Framework = node.GrpcConfig.Framework

		// gRPC clients should have client's array not nil.
		if node.GrpcConfig.Clients != nil {
			languageNode.GrpcConfig.Clients = node.GrpcConfig.Clients
		}

		// gRPC server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.GrpcConfig.Server != nil && node.GrpcConfig.Server.Port != "" {
			// one node, one grpc server
			for _, resource := range node.GrpcConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.GrpcConfig.Server = node.GrpcConfig.Server
		}
	}
}

func addRestConfig(node *corenode.Node, languageNode *LanguageNode) {
	if node.RestConfig != nil {
		languageNode.RestConfig = &corenode.RestConfig{}
		languageNode.RestConfig.Template = node.RestConfig.Template
		languageNode.RestConfig.Framework = node.RestConfig.Framework
		// REST clients should have client's array not nil.
		if node.RestConfig.Clients != nil {
			languageNode.RestConfig.Clients = node.RestConfig.Clients
		}
		// REST server should have port and if port is nil, that means the node is not server, but it's a client.
		if node.RestConfig.Server != nil && node.RestConfig.Server.Port != "" {
			// one node, one rest server
			for _, resource := range node.RestConfig.Server.Resources {
				resource.Name = cases.Title(language.Und, cases.NoLower).String(resource.Name)
				fields := make(map[string]corenode.FieldMetadata)
				for key, value := range resource.Fields {
					// TODO: This is a hack to fix the issue with the case of the field names.
					key = cases.Title(language.Und, cases.NoLower).String(key)
					fields[key] = value
				}
				resource.Fields = fields
			}
			languageNode.RestConfig.Server = node.RestConfig.Server
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
		log.Errorf("Error while populating ws config for node %s", nodeP.ID)
		return err
	}
	return nil
}

func populateWSConfig(compageJSON *core.CompageJSON, nodeP *corenode.Node) error {
	if nodeP.WsConfig != nil && nodeP.WsConfig.Clients != nil {
		// iterate over the ws clients
		for _, client := range nodeP.WsConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
					client.Resources = currentNode.WsConfig.Server.Resources
					break
				}
			}
		}
		return fmt.Errorf("unsupported clientProtocol %s for language : %s",
			"ws", nodeP.Language)
	}
	return nil
}

func populateGRPCClients(compageJSON *core.CompageJSON, nodeP *corenode.Node) {
	if nodeP.GrpcConfig != nil && nodeP.GrpcConfig.Clients != nil {
		// iterate over the grpc clients
		for _, client := range nodeP.GrpcConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
					client.ProtoFileContent = currentNode.GrpcConfig.Server.ProtoFileContent
					client.Resources = currentNode.GrpcConfig.Server.Resources
					break
				}
			}
		}
	}
}

func populateRESTClients(compageJSON *core.CompageJSON, nodeP *corenode.Node) {
	if nodeP.RestConfig != nil && nodeP.RestConfig.Clients != nil {
		// iterate over the rest clients
		for _, client := range nodeP.RestConfig.Clients {
			// process client, iterate over the nodes and retrieve other details from source node.
			for _, currentNode := range compageJSON.Nodes {
				if client.SourceNodeID == currentNode.ID {
					client.OpenAPIFileYamlContent = currentNode.RestConfig.Server.OpenAPIFileYamlContent
					client.Resources = currentNode.RestConfig.Server.Resources
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
			return n.GrpcConfig.Server.ProtoFileContent, n.GrpcConfig.Framework
		}
	}
	return "", ""
}

func GetOpenAPIFileYamlContentAndFrameworkAndTemplateFromNodeForEdge(src string, nodes []*corenode.Node) (string, string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.RestConfig.Server.OpenAPIFileYamlContent, n.RestConfig.Framework, n.RestConfig.Template
		}
	}
	return "", "", ""
}
