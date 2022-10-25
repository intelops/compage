package core

type GenerateProjectInput struct {
	Yaml       string `json:"yaml" binding:"required"`
	User       string `json:"user" binding:"required"`
	Repository string `json:"repository" binding:"required"`
	Name       string `json:"name" binding:"required"`
}

type RegenerateProjectInput struct {
	Yaml string `json:"yaml" binding:"required"`
	User string `json:"user" binding:"required"`
}
