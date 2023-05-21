package test

import (
	"fmt"
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	"testing"
)

func TestGenerator(t *testing.T) {
	jsonString := `{
  "edges": {},
  "nodes": {
    "node-3d": {
      "id": "node-3d",
      "typeId": "node-type-circle",
      "consumerData": {
        "nodeType": "circle",
        "name": "student-service",
        "language": "go",
        "restServerConfig": {
          "framework": "go-gin-server",
          "port": "3434",
           "sqlDb":"MySQL",
          "template": "compage",
          "resources": [
            { "fields": { "Name": "string", "City": "string","Age": "int64" }, "name": "Student" }
          ]
        }
      }
    }
  }
}`
	fmt.Println(jsonString)
	grpcConfigJson := `{"edges":{},"nodes":{"node-b0":{"id":"node-b0","typeId":"node-type-circle","consumerData":{"nodeType":"circle","name":"student-service","language":"go","grpcServerConfig":{"template":"compage","sqlDb":"SQLite","framework":"go-grpc-server","port":"12224","resources":[{"fields":{"Name":"string","RollNumber":"int32","College":"string"},"name":"Student"}]}}}}}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-project",
		Json:           grpcConfigJson,
	}
	//defer func() {
	//	_ = os.RemoveAll("/tmp/first-project")
	//}()

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
