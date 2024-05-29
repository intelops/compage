package xmlconvert

import (
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/clbanning/mxj/v2"
	"gopkg.in/yaml.v2"
)

// ReadXML reads the XML file from the provided path and unmarshals it into a generic map.
func ReadXML(filePath string) (map[string]interface{}, error) {
	// Open the XML file.
	xmlFile, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open XML file: %v", err)
	}
	defer xmlFile.Close()

	// Read the XML file into a byte slice.
	byteValue, _ := io.ReadAll(xmlFile)

	// Convert the XML file into a generic map.
	result, err := mxj.NewMapXml(byteValue)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal XML: %v", err)
	}

	return result, nil
}

// WriteJSON writes the given data to a JSON file at the specified path.
func WriteJSON(data map[string]interface{}, filePath string) error {
	// Marshal the data into a JSON byte slice with indentation.
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %v", err)
	}

	// Write the JSON data to the specified file path.
	err = os.WriteFile(filePath, jsonData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write JSON file: %v", err)
	}

	return nil
}

// WriteYAML writes the given data to a YAML file at the specified path.
func WriteYAML(data map[string]interface{}, filePath string) error {
	// Marshal the data into a YAML byte slice.
	yamlData, err := yaml.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal YAML: %v", err)
	}

	// Write the YAML data to the specified file path.
	err = os.WriteFile(filePath, yamlData, 0644)
	if err != nil {
		return fmt.Errorf("failed to write YAML file: %v", err)
	}

	return nil
}

// CreateFile writes the given data to a file at the specified path based on the file extension.
// Supported file extensions are "json" and "yaml".
func CreateFile(data map[string]interface{}, filePath string, extension string) error {
	// Determine the file type based on the extension.
	switch extension {
	case "json":
		return WriteJSON(data, filePath)
	case "yaml":
		return WriteYAML(data, filePath)
	default:
		return fmt.Errorf("invalid file extension: %s", extension)
	}
}
