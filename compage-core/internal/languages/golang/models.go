package golang

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
)

// constructor function
func (goCY *GoNode) fillDefaults(nodeP node.Node) error {
	for _, serverType := range nodeP.ConsumerData.ServerTypes {
		serverProtocol := serverType.Protocol
		if serverProtocol == "REST" {
			goCY.RestConfig = &RestConfig{
				Server: &RestServer{
					Framework: serverType.Framework,
					Port:      serverType.Port,
					Resources: serverType.Resources,
				},
			}
		} else if serverProtocol == "GRPC" {
			goCY.GrpcConfig = &GrpcConfig{
				Framework: serverType.Framework,
				Port:      serverType.Port,
				Resources: serverType.Resources,
			}
			return errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol, languages.Go))
		} else if serverProtocol == "WS" {
			goCY.WsConfig = &WsConfig{
				Framework: serverType.Framework,
				Port:      serverType.Port,
				Resources: serverType.Resources,
			}
			return errors.New(fmt.Sprintf("unsupported serverProtocol %s for language : %s", serverProtocol, languages.Go))
		}
	}

	// setting default values if no values present
	if goCY.RestConfig == nil {
		goCY.RestConfig = &RestConfig{
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
	if goCY.GrpcConfig == nil {
		goCY.GrpcConfig = &GrpcConfig{
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
	if goCY.WsConfig == nil {
		goCY.WsConfig = &WsConfig{
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
	if goCY.DBConfig == nil {
		goCY.DBConfig = &DBConfig{
			Framework: "gorm",
			Port:      "3306",
			Type:      "mysql",
			Address:   "localhost",
		}
	}

	// set client details to node

	if goCY.Language == "" {
		goCY.Language = "Go"
	}
	if goCY.Template == "" {
		goCY.Template = "compage"
	}

	return nil
}

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

type WsConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

type GrpcConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

type RestServer struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

type RestClient struct {
	Protocol  string `json:"protocol"`
	Port      string `json:"port"`
	Framework string `json:"framework"`
}

type RestConfig struct {
	Server  *RestServer  `json:"server"`
	Clients []RestClient `json:"clients"`
}

// NewNode converts node to GoNode struct
func NewNode(node node.Node) (*GoNode, error) {
	goNode := &GoNode{
		ID:          node.ID,
		Name:        node.ConsumerData.Name,
		NodeType:    node.ConsumerData.NodeType,
		Metadata:    node.ConsumerData.Metadata,
		Annotations: node.ConsumerData.Annotations,
		Language:    node.ConsumerData.Language,
		Template:    node.ConsumerData.Template,
	}

	err := goNode.fillDefaults(node)
	if err != nil {
		return nil, err
	}
	return goNode, nil
}
