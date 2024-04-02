package utils

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	ContextKeyArtifactURL    = contextKey("artifactURL")
	ContextKeyArtifactPath   = contextKey("artifactPath")
	ContextKeyRepositoryURL  = contextKey("repositoryURL")
	ContextKeyRepositoryPath = contextKey("repositoryPath")
)
