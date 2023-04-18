package grpc

import (
	project "github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter"
	"github.com/intelops/compage/core/internal/core"
	"time"
)

// GetProject converts *project.GenerateCodeRequest to *core.Project
func GetProject(input *project.GenerateCodeRequest) (*core.Project, error) {
	compageJSON, err := converter.GetCompageJSON(input.Json)
	if err != nil {
		return nil, err
	}

	return &core.Project{
		CompageJSON:    compageJSON,
		Name:           input.ProjectName,
		RepositoryName: input.RepositoryName,
		UserName:       input.UserName,
		Metadata:       converter.GetMetadata(input.Metadata),
		ModificationDetails: core.ModificationDetails{
			CreatedBy: input.UserName,
			UpdatedBy: input.UserName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
