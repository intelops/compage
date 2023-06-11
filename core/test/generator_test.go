package test

import (
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	"os"
	"testing"
)

func TestRestAndGrpcGeneratorV2(t *testing.T) {
	restConfigJSON := `{
    "edges": {
        "edge-75": {
            "dest": "node-54",
            "id": "edge-75",
            "src": "node-db",
            "consumerData": {
                "name": "final-to-finalv2"
            }
        }
    },
    "nodes": {
        "node-db": {
            "id": "node-db",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "final-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-gin-server",
                        "port": "3400",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "Final"
                            }
                        ]
                    },
                    "template": "compage"
                },
                "grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-grpc-server",
                        "port": "32212",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "FinalGrpc"
                            }
                        ]
                    },
                    "template": "compage"
                }
            }
        },
        "node-54": {
            "id": "node-54",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "final-service-v2",
                "language": "go",
                "grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-grpc-server",
                        "port": "34533",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "FinalV2"
                            }
                        ]
                    },
                    "template": "compage",
                    "clients": [
                        {
                            "sourceNodeName": "final-service",
                            "sourceNodeId": "node-db",
                            "port": "32212"
                        }
                    ]
                },
                "restConfig": {
                    "template": "compage",
                    "server": {
                        "resources": [],
                        "port": "",
                        "framework": "",
                        "sqlDb": "",
                        "openApiFileYamlContent": ""
                    },
                    "clients": [
                        {
                            "sourceNodeName": "final-service",
                            "sourceNodeId": "node-db",
                            "port": "3400"
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
		ProjectName:    "first-rest-and-grpc-project-v2",
		Json:           restConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-and-grpc-project-v2")
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

func TestRestAndGrpcGenerator(t *testing.T) {
	restAndGrpcConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-ef": {
            "id": "node-ef",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "circle",
                "name": "user-service",
                "language": "go",
				"grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-grpc-server",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string",
                                    "RollNumber": "int32",
                                    "College": "string"
                                },
                                "name": "StudentModel"
                            }
                        ]
                    },
                    "template": "compage"
                },
                "restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-gin-server",
                        "port": "1337",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "User"
                            }
                        ]
                    },
                    "template": "compage"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-and-grpc-project",
		Json:           restAndGrpcConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-project")
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
 				"restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-gin-server",
                        "port": "1337",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "User"
                            }
                        ]
                    },
                    "template": "compage"
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
		_ = os.RemoveAll("/tmp/first-rest-project")
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
                "grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "framework": "go-grpc-server",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string",
                                    "RollNumber": "int32",
                                    "College": "string"
                                },
                                "name": "StudentModel"
                            }
                        ]
                    },
                    "template": "compage"
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
