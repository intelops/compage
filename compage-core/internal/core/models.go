package core

import "time"

type ModificationDetails struct {
	CreatedBy string    `json:"createdBy"`
	UpdatedBy string    `json:"updatedBy"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Project struct {
	Name           string `json:"name"`
	RepositoryName string `json:"repositoryName"`
	CompageYaml    *CompageYaml
	ModificationDetails
}

type CompageYaml struct {
	Edges []Edge `yaml:"edges"`
	Nodes []Node `yaml:"nodes"`
}

type Edge struct {
	Dest string `yaml:"dest"`
	ID   string `yaml:"id"`
	Src  string `yaml:"src"`
}

type ConsumerData struct {
	IsClient bool   `yaml:"isClient"`
	IsServer bool   `yaml:"isServer"`
	Language string `yaml:"language"`
	Name     string `yaml:"name"`
	NodeType string `yaml:"nodeType"`
	Type     string `yaml:"type"`
	URL      string `yaml:"url"`
}

type Node struct {
	ConsumerData ConsumerData `yaml:"consumerData,omitempty"`
	ID           string       `yaml:"id"`
	TypeID       string       `yaml:"typeId"`
}
