package coreedge

// Edge can have connection details such as port (Assumption is that the port mentioned is of SRC in edge)
type Edge struct {
	Dest         string           `json:"dest"`
	ID           string           `json:"id"`
	Src          string           `json:"src"`
	ConsumerData EdgeConsumerData `json:"consumerData,omitempty"`
}

// EdgeConsumerData has detailed attributes of an edge
type EdgeConsumerData struct {
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Annotations map[string]string      `json:"annotations,omitempty"`
	Name        string                 `json:"name"`
}
