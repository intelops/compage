package cmd

import (
	"time"

	"github.com/intelops/compage/cmd/models"
	"github.com/intelops/compage/internal/converter"
	"github.com/intelops/compage/internal/core"
)

// GetProject converts *cmd.GenerateCodeCommand to *core.Project
func GetProject(input *models.Project) (*core.Project, error) {
	compageJSON, err := converter.GetCompageJSONForCMD(input.CompageJSON)
	if err != nil {
		return nil, err
	}

	return &core.Project{
		CompageJSON:         compageJSON,
		Name:                input.Name,
		GitPlatformName:     input.GitDetails.Platform.Name,
		GitPlatformURL:      input.GitDetails.Platform.URL,
		GitPlatformUserName: input.GitDetails.Platform.UserName,
		GitRepositoryName:   input.GitDetails.Repository.Name,
		GitRepositoryURL:    input.GitDetails.Repository.URL,
		Metadata:            converter.GetMetadata(input.ProjectMetadata),
		ModificationDetails: core.ModificationDetails{
			CreatedBy: input.GitDetails.Platform.UserName,
			UpdatedBy: input.GitDetails.Platform.UserName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
