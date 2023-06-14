package test

import (
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	"os"
	"testing"
)

func TestRestServerClientsAndGrpcServerClientsCrossConfigGenerator(t *testing.T) {
	restGrpcServerClientsCrossConfigJSON := `{
    "edges": {
        "edge-d6": {
            "dest": "node-74",
            "id": "edge-d6",
            "src": "node-73",
            "consumerData": {
                "name": "invoice-to-payment"
            }
        },
        "edge-12": {
            "dest": "node-73",
            "id": "edge-12",
            "src": "node-97",
            "consumerData": {
                "name": "user-to-invoice"
            }
        },
        "edge-ce": {
            "dest": "node-74",
            "id": "edge-ce",
            "src": "node-97",
            "consumerData": {
                "name": "user-to-payment"
            }
        }
    },
    "nodes": {
        "node-73": {
            "id": "node-73",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "invoice-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "port": "3400",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceDate": "string",
                                    "items": "string",
                                    "Amount": "float64"
                                },
                                "name": "Invoice"
                            }
                        ]
                    },
                    "template": "compage",
                    "framework": "go-gin-server",
                    "clients": [
                        {
                            "sourceNodeName": "user-service",
                            "sourceNodeId": "node-97",
                            "port": "4500"
                        }
                    ]
                }
            }
        },
        "node-97": {
            "id": "node-97",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "user-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "port": "4500",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string",
                                    "Department": "string"
                                },
                                "name": "User"
                            }
                        ]
                    },
                    "template": "compage",
                    "framework": "go-gin-server"
                }
            }
        },
        "node-74": {
            "id": "node-74",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "payment-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "MySQL",
                        "port": "3000",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceId": "int64",
                                    "invoiceAmount": "float32",
                                    "paymentTerms": "string"
                                },
                                "name": "Payment"
                            }
                        ]
                    },
                    "clients": [
                        {
                            "sourceNodeName": "invoice-service",
                            "sourceNodeId": "node-73",
                            "port": "3400"
                        },
                        {
                            "sourceNodeName": "user-service",
                            "sourceNodeId": "node-97",
                            "port": "4500"
                        }
                    ],
                    "template": "compage",
                    "framework": "go-gin-server"
                },
                "grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "port": "34555",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceId": "int64",
                                    "invoiceAmount": "float32",
                                    "paymentTerms": "string"
                                },
                                "name": "Payment"
                            }
                        ]
                    },
                    "template": "compage",
                    "framework": "go-grpc-server"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-server-clients-and-grpc-server-clients-cross-config-project",
		Json:           restGrpcServerClientsCrossConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-clients-and-grpc-server-clients-cross-config-project")
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

func TestRestClientAndGrpcClientCrossConfigGenerator(t *testing.T) {
	restGrpcClientCrossConfigJSON := `{
    "edges": {
        "edge-5d": {
            "dest": "node-5d",
            "id": "edge-5d",
            "src": "node-cc",
            "consumerData": {
                "name": "account-user"
            }
        },
        "edge-e6": {
            "dest": "node-cc",
            "id": "edge-e6",
            "src": "node-5d",
            "consumerData": {
                "name": "user-account"
            }
        }
    },
    "nodes": {
        "node-5d": {
            "id": "node-5d",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "user-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "MySQL",
                        "port": "4000",
                        "resources": [
                            {
                                "fields": {
                                    "Name": "string"
                                },
                                "name": "User"
                            }
                        ]
                    },
                    "template": "compage",
                    "framework": "go-gin-server"
                },
                "grpcConfig": {
                    "clients": [
                        {
                            "sourceNodeName": "account-service",
                            "sourceNodeId": "node-cc",
                            "port": "50033"
                        }
                    ],
                    "template": "compage",
                    "framework": "go-grpc-server"
                }
            }
        },
        "node-cc": {
            "id": "node-cc",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "account-service",
                "language": "go",
                "restConfig": {
                    "clients": [
                        {
                            "sourceNodeName": "user-service",
                            "sourceNodeId": "node-5d",
                            "port": "4000"
                        }
                    ],
                    "template": "compage",
                    "framework": "go-gin-server"
                },
                "grpcConfig": {
                    "server": {
                        "sqlDb": "SQLite",
                        "port": "50033",
                        "resources": [
                            {
                                "fields": {
                                    "NameG": "string"
                                },
                                "name": "Account"
                            }
                        ]
                    },
                    "template": "compage",
                    "framework": "go-grpc-server"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-client-and-grpc-client-cross-config-project",
		Json:           restGrpcClientCrossConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-client-and-grpc-client-cross-config-project")
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

func TestRestAndGrpcServerGenerator(t *testing.T) {
	restAndGrpcServerConfigJSON := `{
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
					"framework": "go-grpc-server",
                    "template": "compage"
                },
                "restConfig": {
                    "server": {
                        "sqlDb": "SQLite",
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
                    "framework": "go-gin-server",
                    "template": "compage"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-and-grpc-server-project",
		Json:           restAndGrpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-and-grpc-server-project")
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

func TestRestServerGenerator(t *testing.T) {
	restServerConfigJSON := `{
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
					"framework": "go-gin-server",
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
		Json:           restServerConfigJSON,
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

func TestGrpcServerGenerator(t *testing.T) {
	grpcServerConfigJSON := `{
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
                    "framework": "go-grpc-server",
                    "template": "compage"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-grpc-server-project",
		Json:           grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project")
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
