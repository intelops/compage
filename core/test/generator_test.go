package test

import (
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	"os"
	"testing"
)

func TestRestGenerator(t *testing.T) {
	restConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-ef": {
            "id": "node-ef",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "circle",
                "name": "user-service",
                "language": "go",
                "restServerConfig": {
                    "sqlDb": "MySQL",
                    "framework": "go-gin-server",
                    "port": "3000",
                    "template": "compage",
                    "resources": [
                        {
                            "fields": {
                                "Name": "string"
                            },
                            "name": "User"
                        },
 						{
                            "fields": {
                                "City": "string"
                            },
                            "name": "Town"
                        }
                    ]
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-project",
		Json:           restConfigJSON,
	}
	defer func() {
		//_ = os.RemoveAll("/tmp/first-rest-project")
	}()

	// retrieve project struct
	getProject, err := grpc.GetProject(&input)
	if err != nil {
		t.Errorf("grpc.GetProject conversion failed = %v", getProject)
	}
	// trigger project generation
	if err0 := handlers.Handle(getProject); err0 != nil {
		t.Errorf("handlers.Handle failed %s", err0.Error())
	}
}

func TestGrpcGenerator(t *testing.T) {
	grpcConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-b0": {
            "id": "node-b0",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "circle",
                "name": "student-service",
                "language": "go",
                "grpcServerConfig": {
                    "template": "compage",
                    "sqlDb": "SQLite",
                    "framework": "go-grpc-server",
                    "port": "50051",
                    "resources": [
                        {
                            "fields": {
                                "Name": "string",
                                "RollNumber": "int32",
                                "College": "string"
                            },
                            "name": "Student"
                        }
                    ]
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-grpc-project",
		Json:           grpcConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-project")
	}()

	// retrieve project struct
	getProject, err := grpc.GetProject(&input)
	if err != nil {
		t.Errorf("grpc.GetProject conversion failed = %v", getProject)
	}
	// trigger project generation
	if err0 := handlers.Handle(getProject); err0 != nil {
		t.Errorf("handlers.Handle failed %s", err0.Error())
	}
}
