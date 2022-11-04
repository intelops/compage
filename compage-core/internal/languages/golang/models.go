package golang

import (
	"github.com/kube-tarian/compage-core/internal/core/node"
)

// constructor function
func (goCY *GoCompageYaml) fillDefaults() {
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
	if goCY.Language == "" {
		goCY.Language = "Go"
	}
	if goCY.DBFramework == "" {
		goCY.DBFramework = "gorm"
	}
}

type GoCompageYaml struct {
	node.ConsumerData
	RestFramework string `json:"restFramework"`
	GrpcFramework string `json:"grpcFramework"`
	WsFramework   string `json:"wsFramework"`
	DBFramework   string `json:"dbFramework"`
}
