package golang

import (
	"errors"
	"fmt"
	"github.com/kube-tarian/compage-core/internal/core/node"
	"github.com/kube-tarian/compage-core/internal/languages"
)

// constructor function
func (goCY *GoNode) fillDefaults() error {
	for _, serverType := range goCY.ConsumerData.ServerTypes {
		serverProtocol := serverType.Protocol
		if serverProtocol == "REST" {
			goCY.RestConfig = &RestConfig{
				Framework: serverType.Framework,
				Port:      serverType.Port,
				Resources: serverType.Resources,
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
			Framework: "gin",
			Port:      "8888",
			Resources: []node.Resource{
				{
					Name:   "user",
					Fields: map[string]string{"name": "string"},
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

	if goCY.ConsumerData.Language == "" {
		goCY.ConsumerData.Language = "Go"
	}
	if goCY.ConsumerData.Template == "" {
		goCY.ConsumerData.Template = "compage"
	}

	return nil
}

const (
	Compage string = "compage"
)

type GoNode struct {
	node.Node
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

type RestConfig struct {
	Framework string          `json:"framework"`
	Port      string          `json:"port"`
	Resources []node.Resource `json:"resources"`
}

// GetNode converts node to GoNode struct
func GetNode(node node.Node) (*GoNode, error) {
	goNode := &GoNode{
		Node: node,
	}

	err := goNode.fillDefaults()
	if err != nil {
		return nil, err
	}
	return goNode, nil
}
