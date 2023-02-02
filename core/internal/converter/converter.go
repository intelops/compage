package converter

import (
	"encoding/json"
	"fmt"
	"github.com/kube-tarian/compage/core/internal/core"
	"github.com/kube-tarian/compage/core/internal/core/node"
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

// ConvertMap converts compageJson structure to {edges: [], nodes:[]}
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

// GetCompageJson converts json string to CompageJson struct
func GetCompageJson(jsonString string) (*core.CompageJson, error) {
	x := map[string]interface{}{}
	if err := json.Unmarshal([]byte(jsonString), &x); err != nil {
		return nil, err
	}
	convertedX := ConvertMap(x)
	convertedXBytes, err := json.Marshal(convertedX)
	if err != nil {
		return nil, err
	}
	compageJson := &core.CompageJson{}
	if err = json.Unmarshal(convertedXBytes, compageJson); err != nil {
		return nil, err
	}

	// Validate compageJson
	if err := validate(compageJson); err != nil {
		return nil, err
	}

	return compageJson, nil
}

// validate validates edges and nodes in compage json.
func validate(compageJson *core.CompageJson) error {
	// validations on node fields and setting default values.
	compageJson = populateExternalNodeInEdges(compageJson)
	for _, n := range compageJson.Nodes {
		// name can't be empty for node
		if n.ConsumerData.Name == "" {
			return fmt.Errorf("name should not be empty")
		}
		// set default language as go
		if n.ConsumerData.Language == "" {
			n.ConsumerData.Language = languages.Go
		}
		// set default template as compage
		if n.ConsumerData.Template == "" {
			n.ConsumerData.Template = languages.Compage
		}
	}
	for _, e := range compageJson.Edges {
		if e.ConsumerData.ExternalNodeName == "" {
			return fmt.Errorf("externalNodeName should not be empty")
		}
	}
	// no need to populate port in individual edge as we need to have that validation on ui itself.
	// Reasons 1. user may use grpc protocol when the src node doesn't have one. We need to show the protocols in
	// edge dropdown based on the server configs on src node :D

	return nil
}

func populateExternalNodeInEdges(compageJson *core.CompageJson) *core.CompageJson {
	for _, edge := range compageJson.Edges {
		if edge.ConsumerData.ExternalNodeName == "" {
			edge.ConsumerData.ExternalNodeName, edge.ConsumerData.OpenApiFileYamlContent = getExternalNodeAndOpenApiFileYamlContentForEdge(edge.Src, compageJson.Nodes)
		}
	}
	return compageJson
}

func getExternalNodeAndOpenApiFileYamlContentForEdge(src string, nodes []*node.Node) (string, string) {
	for _, n := range nodes {
		if src == n.ID {
			return n.ConsumerData.Name, n.ConsumerData.OpenApiFileYamlContent
		}
	}
	return "", ""
}

// GetMetadata converts string to map
func GetMetadata(metadataInput string) map[string]interface{} {
	metadata := map[string]interface{}{}
	if err := json.Unmarshal([]byte(metadataInput), &metadata); err != nil {
		return nil
	}
	return metadata
}
