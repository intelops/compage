package converter

import (
	"encoding/json"
	"fmt"
	"github.com/kube-tarian/compage/core/internal/core"
	"github.com/kube-tarian/compage/core/internal/languages"
	"golang.org/x/exp/maps"
)

// GetNodes converts nodes map to string.
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

// GetEdges converts edges map to string.
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

// ConvertMap converts compageYaml structure to {edges: [], nodes:[]}
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

// GetCompageYaml converts yaml string to CompageYaml struct
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
	compageYaml := &core.CompageYaml{}
	if err = json.Unmarshal(convertedXBytes, compageYaml); err != nil {
		return nil, err
	}

	// Validate compageYaml
	if err := validate(compageYaml); err != nil {
		return nil, err
	}

	return compageYaml, nil
}

// validate validates edges and nodes in compage yaml.
func validate(compageYaml *core.CompageYaml) error {
	// validations on node fields and setting default values.
	for _, node := range compageYaml.Nodes {
		// name can't be empty for node
		if node.ConsumerData.Name == "" {
			return fmt.Errorf("name should not be empty")
		}
		// set default language as go
		if node.ConsumerData.Language == "" {
			node.ConsumerData.Language = languages.Go
		}
		// set default template as compage
		if node.ConsumerData.Template == "" {
			node.ConsumerData.Template = languages.Compage
		}
	}

	// no need to populate port in individual edge as we need to have that validation on ui itself.
	// Reasons 1. user may use grpc protocol when the src node doesn't have one. We need to show the protocols in
	// edge dropdown based on the server configs on src node :D

	return nil
}

// GetMetadata converts string to map
func GetMetadata(metadataInput string) map[string]interface{} {
	metadata := map[string]interface{}{}
	if err := json.Unmarshal([]byte(metadataInput), &metadata); err != nil {
		return nil
	}
	return metadata
}
