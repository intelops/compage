package golang

import (
	"github.com/kube-tarian/compage-core/internal/core/node"
)

// constructor function
func (goCY *GoNode) fillDefaults() {
	// setting default values if no values present
	if goCY.RestFramework == "" {
		goCY.RestFramework = "gin"
	}
	if goCY.GrpcFramework == "" {
		goCY.GrpcFramework = "grpcCore"
	}
	if goCY.WsFramework == "" {
		goCY.WsFramework = "Stomp"
	}
	if goCY.ConsumerData.Language == "" {
		goCY.ConsumerData.Language = "Go"
	}
	if goCY.DBFramework == "" {
		goCY.DBFramework = "gorm"
	}
}

const (
	Compage string = "compage"
)

type GoNode struct {
	node.Node
	RestFramework string `json:"restFramework"`
	GrpcFramework string `json:"grpcFramework"`
	WsFramework   string `json:"wsFramework"`
	DBFramework   string `json:"dbFramework"`
}

// GetGoNode converts node to GoNode struct
func GetGoNode(node node.Node) *GoNode {
	goNode := &GoNode{
		Node: node,
	}

	goNode.fillDefaults()
	return goNode
}
