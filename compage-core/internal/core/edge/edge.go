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
	ClientTypes []map[string]string    `yaml:"clientTypes"`
	Metadata    map[string]interface{} `yaml:"metadata"`
	Annotations map[string]string      `yaml:"annotations"`
}
