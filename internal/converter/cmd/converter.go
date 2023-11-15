package cmd

import (
	"github.com/intelops/compage/cmd/models"
	"github.com/intelops/compage/internal/converter"
	"github.com/intelops/compage/internal/core"
	"time"
)

// GetProject converts *cmd.GenerateCodeCommand to *core.Project
func GetProject(input *models.Project) (*core.Project, error) {
	compageJSON, err := converter.GetCompageJSON("")
	if err != nil {
		return nil, err
	}

	return &core.Project{
		CompageJSON:         compageJSON,
		Name:                input.Name,
		GitRepositoryName:   input.GitDetails.Repository.Name,
		GitPlatformUserName: input.GitDetails.Platform.UserName,
		GitPlatformURL:      input.GitDetails.Platform.Url,
		Metadata:            converter.GetMetadata(input.ProjectMetadata),
		ModificationDetails: core.ModificationDetails{
			CreatedBy: input.GitDetails.Platform.UserName,
			UpdatedBy: input.GitDetails.Platform.UserName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
