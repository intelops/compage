package core

import "time"

// ModificationDetails has creation and modification details.
type ModificationDetails struct {
	CreatedBy string    `json:"createdBy"`
	UpdatedBy string    `json:"updatedBy"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Project is top level struct depicting the monorepo and resembling to github repository.
// It has a single compage.json and can have multiple nodes and edges (projects and connections)  internally.
type Project struct {
	Name           string `json:"name"`
	RepositoryName string `json:"repositoryName"`
	CompageYaml    *CompageYaml
	ModificationDetails
}

// CompageYaml has all edges and nodes
type CompageYaml struct {
	Edges []Edge `yaml:"edges"`
	Nodes []Node `yaml:"nodes"`
}

// Edge can have connection details such as port (Assumption is that the port mentioned is of SRC in edge)
type Edge struct {
	Dest string `yaml:"dest"`
	ID   string `yaml:"id"`
	Src  string `yaml:"src"`
	Port string `yaml:"port"`
}

// ConsumerData has detailed attributes of Node
type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	// Name of component
	Name     string `yaml:"name"`
	NodeType string `yaml:"nodeType"`
	Type     string `yaml:"type"`
	URL      string `yaml:"url"`
	// resources can be multiple (user, account)
	Resources []Resource `yaml:"resources"`
}

// Resource depicts the endpoint(e.g. /user, /account)
type Resource struct {
	// resources fields (e.g. name, age in user)
	Fields map[string]string `yaml:"fields"`
}

// Node depicts a separate repository
type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}
