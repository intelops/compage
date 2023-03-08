package rest

import (
	"github.com/intelops/compage/core/internal/converter"
	"github.com/intelops/compage/core/internal/core"
	"time"
)

// GetProject converts core.ProjectInput to *core.Project.
func GetProject(input core.ProjectInput) (*core.Project, error) {
	compageJson, err := converter.GetCompageJson(input.Json)
	if err != nil {
		return nil, err
	}

	return &core.Project{
		CompageJson:    compageJson,
		Name:           input.ProjectName,
		RepositoryName: input.RepositoryName,
		Metadata:       converter.GetMetadata(input.Metadata),
		ModificationDetails: core.ModificationDetails{
			CreatedBy: input.UserName,
			UpdatedBy: input.UserName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
