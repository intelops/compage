package edge

// Edge can have connection details such as port (Assumption is that the port mentioned is of SRC in edge)
type Edge struct {
	Dest         string       `yaml:"dest"`
	ID           string       `yaml:"id"`
	Src          string       `yaml:"src"`
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
}

// ConsumerData has detailed attributes of an edge
type ConsumerData struct {
	ClientTypes []ClientType           `yaml:"clientTypes,omitempty"`
	Metadata    map[string]interface{} `yaml:"metadata,omitempty"`
	Annotations map[string]string      `yaml:"annotations,omitempty"`
}

type ClientType struct {
	Protocol string `json:"protocol"`
	Port     string `json:"port"`
	// Framework will be the same as client's rest server framework
	// Framework string `json:"framework"`
}
