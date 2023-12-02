package converter

import (
	"encoding/json"
	"fmt"
	"github.com/intelops/compage/internal/core"
	"github.com/intelops/compage/internal/languages"
	"github.com/intelops/compage/internal/languages/templates"
	log "github.com/sirupsen/logrus"
	"golang.org/x/exp/maps"
)

// GetNodes converts nodes map to string.
func GetNodes(nodes interface{}) interface{} {
	if nodes != nil {
		nodesBytes, err := json.Marshal(maps.Values(nodes.(map[string]interface{})))
		if err != nil {
			log.Errorf("error marshalling nodes: %v", err)
			return err
		}
		return string(nodesBytes)
	}
	return ""
}

// GetEdges converts an edge map to string.
func GetEdges(edges interface{}) interface{} {
	if edges != nil {
		edgesBytes, err := json.Marshal(maps.Values(edges.(map[string]interface{})))
		if err != nil {
			log.Errorf("error marshalling edges: %v", err)
			return err
		}
		return string(edgesBytes)
	}
	return ""
}

// ConvertMap converts compageJSON structure to {edges: [], nodes:[]}
func ConvertMap(x map[string]interface{}) map[string]interface{} {
	// convert key-value-based edges to edges Slice
	if x["edges"] != nil {
		x["edges"] = maps.Values(x["edges"].(map[string]interface{}))
	}
	// convert key-value-based nodes to nodes Slice
	if x["nodes"] != nil {
		x["nodes"] = maps.Values(x["nodes"].(map[string]interface{}))
	}
	return x
}

// GetCompageJSONForGRPC converts json string to CompageJSON struct
func GetCompageJSONForGRPC(jsonString string) (*core.CompageJSON, error) {
	x := map[string]interface{}{}
	if err := json.Unmarshal([]byte(jsonString), &x); err != nil {
		log.Errorf("error unmarshalling compageJSON: %v", err)
		return nil, err
	}
	convertedX := ConvertMap(x)
	convertedXBytes, err1 := json.Marshal(convertedX)
	if err1 != nil {
		log.Errorf("error marshalling compageJSON: %v", err1)
		return nil, err1
	}
	compageJSON := &core.CompageJSON{}
	if err2 := json.Unmarshal(convertedXBytes, compageJSON); err2 != nil {
		log.Errorf("error unmarshalling compageJSON: %v", err2)
		return nil, err2
	}

	// Validate compageJSON
	if err3 := validate(compageJSON); err3 != nil {
		log.Errorf("error validating compageJSON: %v", err3)
		return nil, err3
	}

	return compageJSON, nil
}

// GetCompageJSONForCMD converts compageJSON map to CompageJSON struct
func GetCompageJSONForCMD(jsonMap map[string]interface{}) (*core.CompageJSON, error) {
	convertedXBytes, err1 := json.Marshal(jsonMap)
	if err1 != nil {
		log.Errorf("error marshalling compageJSON: %v", err1)
		return nil, err1
	}
	compageJSON := &core.CompageJSON{}
	if err2 := json.Unmarshal(convertedXBytes, compageJSON); err2 != nil {
		log.Errorf("error unmarshalling compageJSON: %v", err2)
		return nil, err2
	}

	// Validate compageJSON
	if err3 := validate(compageJSON); err3 != nil {
		log.Errorf("error validating compageJSON: %v", err3)
		return nil, err3
	}

	return compageJSON, nil
}

// validate validates edges and nodes in compage json.
func validate(compageJSON *core.CompageJSON) error {
	// validations on node fields and setting default values.
	for _, n := range compageJSON.Nodes {
		// name can't be empty for node
		if n.Name == "" {
			return fmt.Errorf("name should not be empty")
		}
		// set the default language as go
		if n.Language == "" {
			n.Language = languages.Go
		}
		// set default template as compage
		if n.RestConfig != nil && n.RestConfig.Template == "" {
			n.RestConfig.Template = templates.Compage
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
	if len(metadataInput) > 0 {
		if err0 := json.Unmarshal([]byte(metadataInput), &metadata); err0 != nil {
			log.Errorf("error unmarshalling metadata: %v", err0)
			return nil
		}
	}
	return metadata
}
