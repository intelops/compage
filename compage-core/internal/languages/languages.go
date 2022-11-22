package languages

import (
	"github.com/kube-tarian/compage-core/internal/core/edge"
	"github.com/kube-tarian/compage-core/internal/core/node"
)

const Go = "Golang"
const NodeJs = "NodeJs"

func GetOtherServersInfo(edges []edge.Edge, node node.Node) (map[string]interface{}, error) {
	m := map[string]interface{}{}
	for _, e := range edges {
		if e.Dest == node.ID {
			m[e.ID] = e
		}
	}
	return m, nil
}
