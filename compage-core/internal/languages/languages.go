package languages

import (
	"github.com/kube-tarian/compage-core/internal/core/edge"
	"github.com/kube-tarian/compage-core/internal/core/node"
)

const Go = "Golang"
const NodeJs = "NodeJs"

func GetOtherServersInfo(edges []edge.Edge, node node.Node) (map[string]interface{}, error) {
	m := map[string]interface{}{}
	for _, edge := range edges {
		if edge.Dest == node.ID {
			m[edge.ID] = edge
		}
	}
	return m, nil
}
