package grpc

import (
	project "github.com/kube-tarian/compage-core/gen/api/v1"
	"github.com/kube-tarian/compage-core/internal/converter"
	"github.com/kube-tarian/compage-core/internal/core"
)

func GetProject(input *project.ProjectRequest) (*core.Project, error) {
	compageYaml, err := converter.GetCompageYaml(input.Yaml)
	if err != nil {
		return nil, err
	}
	return &core.Project{
		CompageYaml:    compageYaml,
		Name:           input.GetProjectName(),
		RepositoryName: input.RepositoryName,
	}, nil
}
