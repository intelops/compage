package coreedge

// Edge can have connection details such as port (Assumption is that the port mentioned is of SRC in edge)
type Edge struct {
	ID          string                 `json:"id"`
	Src         string                 `json:"src"`
	Dest        string                 `json:"dest"`
	Metadata    map[string]interface{} `json:"metadata,omitempty"`
	Annotations map[string]string      `json:"annotations,omitempty"`
	Name        string                 `json:"name"`
}
