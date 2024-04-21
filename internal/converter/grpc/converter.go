package grpc

import (
	project "github.com/intelops/compage/gen/api/v1"
	"github.com/intelops/compage/internal/converter"
	"github.com/intelops/compage/internal/core"
	log "github.com/sirupsen/logrus"
	"os"
	"time"
)

// GetProject converts *project.GenerateCodeRequest to *core.Project
func GetProject(input *project.GenerateCodeRequest) (*core.Project, error) {
	compageJSON, err := converter.GetCompageJSONForGRPC(input.ProjectJSON)
	if err != nil {
		log.Errorf("error getting compageJSON: %v", err)
		return nil, err
	}
	if len(input.CompageCoreVersion) == 0 {
		compageCoreVersion := os.Getenv("COMPAGE_CORE_VERSION")
		if compageCoreVersion != "" {
			input.CompageCoreVersion = compageCoreVersion
		} else {
			log.Errorf("COMPAGE_CORE_VERSION is not set in the environment variables")
			return nil, err
		}
	}

	return &core.Project{
		CompageJSON: compageJSON,
		Name:        input.ProjectName,
		// latest is the tag for every ui based request
		CompageCoreVersion:  input.CompageCoreVersion,
		GitRepositoryName:   input.GitRepositoryName,
		GitPlatformUserName: input.GitPlatformUserName,
		GitPlatformURL:      input.GitPlatformURL,
		Metadata:            converter.GetMetadata(input.ProjectMetadata),
		ModificationDetails: core.ModificationDetails{
			CreatedBy: input.GitPlatformUserName,
			UpdatedBy: input.GitPlatformUserName,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
		},
	}, nil
}
