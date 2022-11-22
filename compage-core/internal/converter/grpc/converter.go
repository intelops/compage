package grpc

import (
	project "github.com/kube-tarian/compage-core/gen/api/v1"
	"github.com/kube-tarian/compage-core/internal/converter"
	"github.com/kube-tarian/compage-core/internal/core"
	"time"
)

// GetProject converts *project.ProjectRequest to *core.Project
func GetProject(input *project.ProjectRequest) (*core.Project, error) {
	compageYaml, err := converter.GetCompageYaml(input.Yaml)
	if err != nil {
		return nil, err
	}

	return &core.Project{
		CompageYaml:    compageYaml,
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
