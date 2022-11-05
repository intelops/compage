package core

// ProjectInput depicts the DTO for rest server (compage-core)
type ProjectInput struct {
	Yaml           string `json:"yaml" binding:"required"`
	UserName       string `json:"userName" binding:"required"`
	RepositoryName string `json:"repositoryName" binding:"required"`
	ProjectName    string `json:"projectName" binding:"required"`
	Metadata       string `json:"metadata" binding:"required"`
}
