package converter

import (
	"encoding/json"
	"github.com/kube-tarian/compage-core/internal/core"
	"golang.org/x/exp/maps"
)

func GetNodes(nodes interface{}) interface{} {
	if nodes != nil {
		nodesBytes, err := json.Marshal(maps.Values(nodes.(map[string]interface{})))
		if err != nil {
			return err
		}
		return string(nodesBytes)
	}
	return ""
}

func GetEdges(edges interface{}) interface{} {
	if edges != nil {
		edgesBytes, err := json.Marshal(maps.Values(edges.(map[string]interface{})))
		if err != nil {
			return err
		}
		return string(edgesBytes)
	}
	return ""
}

func ConvertMap(x map[string]interface{}) map[string]interface{} {
	// convert key-value based edges to edges Slice
	if x["edges"] != nil {
		x["edges"] = maps.Values(x["edges"].(map[string]interface{}))
	}
	// convert key-value based nodes to nodes Slice
	if x["nodes"] != nil {
		x["nodes"] = maps.Values(x["nodes"].(map[string]interface{}))
	}
	return x
}

func GetCompageYaml(yaml string) (*core.CompageYaml, error) {
	x := map[string]interface{}{}
	if err := json.Unmarshal([]byte(yaml), &x); err != nil {
		return nil, err
	}
	convertedX := ConvertMap(x)
	convertedXBytes, err := json.Marshal(convertedX)
	if err != nil {
		return nil, err
	}
	compageYaml := core.CompageYaml{}
	if err = json.Unmarshal(convertedXBytes, &compageYaml); err != nil {
		return nil, err
	}
	return &compageYaml, nil
}
