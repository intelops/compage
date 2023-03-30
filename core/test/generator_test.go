package test

import (
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	log "github.com/sirupsen/logrus"
	"os"
	"testing"
)

func TestGenerator(t *testing.T) {
	// TODO update latest json below.
	jsonString := ""
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-project",
		Json:           jsonString,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-project")
	}()

	// retrieve project struct
	getProject, err := grpc.GetProject(&input)
	if err != nil {
		log.Errorf("err : %s", err.Error())
		return
	}
	// trigger project generation
	if err0 := handlers.Handle(getProject); err0 != nil {
		log.Errorf("err : %s", err0.Error())
	}
}
