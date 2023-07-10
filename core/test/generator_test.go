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
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "Address": {
                                        "datatype": "Address",
                                        "isComposite": true
                                    },
                                    "Age": {
                                        "datatype": "int"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    }
                                },
                                "name": "User"
                            },
                            {
                                "fields": {
                                    "Street": {
                                        "datatype": "string"
                                    },
                                    "PinCode": {
                                        "datatype": "string"
                                    },
                                    "City": {
                                        "datatype": "string"
                                    }
                                },
                                "name": "Address"
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
		ProjectName:    "first-rest-server-project",
		Json:           restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project")
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
                                    "College": "string",
									"Sign": "rune",
									"Marks": "int",
									"GateScore": "uint",
									"IsPassed": "bool"
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

func TestRestServerWithOpenApiGenerator(t *testing.T) {
	restServerWithOpenAPIConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-02": {
            "id": "node-02",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "node-type-circle",
                "name": "sample-service",
                "language": "go",
                "restConfig": {
                    "server": {
                        "sqlDb": "",
                        "port": "8080",
                        "resources": [],
                        "openApiFileYamlContent": "swagger: \"2.0\"\ninfo:\n  version: 1.0.0\n  title: Swagger Petstore\n  license:\n    name: MIT\nhost: petstore.swagger.io\nbasePath: /v1\nschemes:\n  - http\nconsumes:\n  - application/json\nproduces:\n  - application/json\npaths:\n  /pets:\n    get:\n      summary: List all pets\n      operationId: listPets\n      tags:\n        - pets\n      parameters:\n        - name: limit\n          in: query\n          description: How many items to return at one time (max 100)\n          required: false\n          type: integer\n          format: int32\n      responses:\n        \"200\":\n          description: A paged array of pets\n          headers:\n            x-next:\n              type: string\n              description: A link to the next page of responses\n          schema:\n            $ref: '#/definitions/Pets'\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\n    post:\n      summary: Create a pet\n      operationId: createPets\n      tags:\n        - pets\n      responses:\n        \"201\":\n          description: Null response\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\n  /pets/{petId}:\n    get:\n      summary: Info for a specific pet\n      operationId: showPetById\n      tags:\n        - pets\n      parameters:\n        - name: petId\n          in: path\n          required: true\n          description: The id of the pet to retrieve\n          type: string\n      responses:\n        \"200\":\n          description: Expected response to a valid request\n          schema:\n            $ref: '#/definitions/Pets'\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\ndefinitions:\n  Pet:\n    type: \"object\"\n    required:\n      - id\n      - name\n    properties:\n      id:\n        type: integer\n        format: int64\n      name:\n        type: string\n      tag:\n        type: string\n  Pets:\n    type: array\n    items:\n      $ref: '#/definitions/Pet'\n  Error:\n    type: \"object\"\n    required:\n      - code\n      - message\n    properties:\n      code:\n        type: integer\n        format: int32\n      message:\n        type: string\n"
                    },
                    "template": "openAPI",
                    "framework": "go-gin-server"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-rest-server-with-openapi-project",
		Json:           restServerWithOpenAPIConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-with-openapi-project")
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

func TestWsServerGenerator(t *testing.T) {
	wsServerConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-b0": {
            "id": "node-b0",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "circle",
                "name": "student-service",
                "language": "go",
                "wsConfig": {
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
                    "framework": "go-ws-server",
                    "template": "compage"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-ws-server-project",
		Json:           wsServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-ws-server-project")
	}()

	// retrieve project struct
	getProject, err := grpc.GetProject(&input)
	if err != nil {
		t.Errorf("grpc.GetProject conversion failed = %v", getProject)
	}
	// trigger project generation
	if err0 := handlers.Handle(getProject); err0 != nil {
		if err0.Error() == "unsupported protocol ws for language go" {
			// TODO implementation is yet to be done
		} else {
			t.Errorf("handlers.Handle failed %s", err0.Error())
		}
	}
}
