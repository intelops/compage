package test

import (
	"github.com/intelops/compage/core/gen/api/v1"
	"github.com/intelops/compage/core/internal/converter/grpc"
	"github.com/intelops/compage/core/internal/handlers"
	"os"
	"strings"
	"testing"
)

func TestRestServerGeneratorNoSql(t *testing.T) {
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
                        "noSQLDB": "MongoDB",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-nosql",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project-nosql")
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

func TestRestServerGeneratorSqlMap(t *testing.T) {
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
                        "sqlDB": "Map",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-map",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project-map")
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

func TestRestServerGeneratorSqlSQLite(t *testing.T) {
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
                        "sqlDB": "SQLite",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-sqlite",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project-sqlite")
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

func TestRestServerGeneratorSqlMySQL(t *testing.T) {
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
                        "sqlDB": "MySQL",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-mysql",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project-mysql")
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

func TestRestServerGeneratorSqlSQLiteGORM(t *testing.T) {
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
                        "sqlDB": "SQLite-GORM",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-sqlite-gorm",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		//_ = os.RemoveAll("/tmp/first-rest-server-project-sqlite-gorm")
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

func TestRestServerGeneratorSqlMySQLGORM(t *testing.T) {
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
                        "sqlDB": "MySQL-GORM",
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-mysql-gorm",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-rest-server-project-mysql-gorm")
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
                "language": "$$LANGUAGE$$",
                "restConfig": {
                    "server": {
                        "sqlDB": "",
                        "port": "8080",
                        "resources": [],
                        "openApiFileYamlContent": "swagger: \"2.0\"\ninfo:\n  version: 1.0.0\n  title: Swagger Petstore\n  license:\n    name: MIT\nhost: petstore.swagger.io\nbasePath: /v1\nschemes:\n  - http\nconsumes:\n  - application/json\nproduces:\n  - application/json\npaths:\n  /pets:\n    get:\n      summary: List all pets\n      operationId: listPets\n      tags:\n        - pets\n      parameters:\n        - name: limit\n          in: query\n          description: How many items to return at one time (max 100)\n          required: false\n          type: integer\n          format: int32\n      responses:\n        \"200\":\n          description: A paged array of pets\n          headers:\n            x-next:\n              type: string\n              description: A link to the next page of responses\n          schema:\n            $ref: '#/definitions/Pets'\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\n    post:\n      summary: Create a pet\n      operationId: createPets\n      tags:\n        - pets\n      responses:\n        \"201\":\n          description: Null response\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\n  /pets/{petId}:\n    get:\n      summary: Info for a specific pet\n      operationId: showPetById\n      tags:\n        - pets\n      parameters:\n        - name: petId\n          in: path\n          required: true\n          description: The id of the pet to retrieve\n          type: string\n      responses:\n        \"200\":\n          description: Expected response to a valid request\n          schema:\n            $ref: '#/definitions/Pets'\n        default:\n          description: unexpected error\n          schema:\n            $ref: '#/definitions/Error'\ndefinitions:\n  Pet:\n    type: \"object\"\n    required:\n      - id\n      - name\n    properties:\n      id:\n        type: integer\n        format: int64\n      name:\n        type: string\n      tag:\n        type: string\n  Pets:\n    type: array\n    items:\n      $ref: '#/definitions/Pet'\n  Error:\n    type: \"object\"\n    required:\n      - code\n      - message\n    properties:\n      code:\n        type: integer\n        format: int32\n      message:\n        type: string\n"
                    },
                    "template": "openAPI",
                    "framework": "$$FRAMEWORK$$"
                }
            }
        }
    }
}`
	var tests = []struct {
		language  string
		framework string
		want      error
	}{
		{"java", "java-micronaut-server", nil},
		{"java", "java-undertow-server", nil},
		{"java", "spring", nil},
		{"python", "python-flask", nil},
		{"ruby", "ruby-on-rails", nil},
		{"ruby", "ruby-sinatra", nil},
		{"go", "go-gin-server", nil},
		{"go", "go-server", nil},
		{"go", "go-echo-server", nil},
		{"javascript", "nodejs-express-server", nil},
		{"rust", "rust-server", nil},
	}

	for _, tt := range tests {
		t.Run(tt.language, func(t *testing.T) {
			replacedConfig := strings.Replace(restServerWithOpenAPIConfigJSON, "$$LANGUAGE$$", tt.language, 1)
			replacedConfig = strings.Replace(replacedConfig, "$$FRAMEWORK$$", tt.framework, 1)
			input := project.GenerateCodeRequest{
				GitPlatformURL:      "https://github.com",
				GitPlatformUserName: "mahendraintelops",
				GitRepositoryName:   "first-project-github",
				ProjectName:         "first-openapi-based-project-" + tt.language,
				ProjectJSON:         replacedConfig,
			}
			defer func() {
				_ = os.RemoveAll("/tmp/first-openapi-based-project-" + tt.language)
			}()

			// retrieve project struct
			getProject, err := grpc.GetProject(&input)
			if err != nil {
				t.Errorf("grpc.GetProject conversion failed = %v", getProject)
			}

			// trigger project generation
			ans := handlers.Handle(getProject)
			if ans != tt.want {
				t.Errorf("got %v, want %v", ans, tt.want)
			}
		})
	}
}

func TestGrpcServerGeneratorNoSql(t *testing.T) {
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
						"noSQLDB": "MongoDB",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-nosql",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-nosql")
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

func TestGrpcServerGeneratorSqlMap(t *testing.T) {
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
                        "sqlDB": "Map",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-map",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-map")
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

func TestGrpcServerGeneratorSqlSQLite(t *testing.T) {
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
                        "sqlDB": "SQLite",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-sqlite",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-sqlite")
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

func TestGrpcServerGeneratorSqlMySQL(t *testing.T) {
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
                        "sqlDB": "MySQL",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-mysql",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-mysql")
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

func TestGrpcServerGeneratorSqlSQLiteGORM(t *testing.T) {
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
                        "sqlDB": "SQLite-GORM",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-sqlite-gorm",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-sqlite-gorm")
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

func TestGrpcServerGeneratorSqlMySQLGORM(t *testing.T) {
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
                        "sqlDB": "MySQL-GORM",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    },
                                    "Sign": {
                                        "datatype": "rune"
                                    },
                                    "Marks": {
                                        "datatype": "int"
                                    },
                                    "GateScore": {
                                        "datatype": "uint"
                                    },
                                    "IsPassed": {
                                        "datatype": "bool"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-grpc-server-project-mysql-gorm",
		ProjectJSON:         grpcServerConfigJSON,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-grpc-server-project-mysql-gorm")
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
                        "sqlDB": "SQLite",
                        "port": "3400",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceDate": {
                                        "datatype": "string"
                                    },
                                    "items": {
                                        "datatype": "string"
                                    },
                                    "Amount": {
                                        "datatype": "float64"
                                    }
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
                        "sqlDB": "SQLite",
                        "port": "4500",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "Department": {
                                        "datatype": "string"
                                    }
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
                        "sqlDB": "MySQL",
                        "port": "3000",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceId": {
                                        "datatype": "int64"
                                    },
                                    "invoiceAmount": {
                                        "datatype": "float32"
                                    },
                                    "paymentTerms": {
                                        "datatype": "string"
                                    }
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
                        "sqlDB": "SQLite",
                        "port": "34555",
                        "resources": [
                            {
                                "fields": {
                                    "invoiceId": {
                                        "datatype": "int64"
                                    },
                                    "invoiceAmount": {
                                        "datatype": "float32"
                                    },
                                    "paymentTerms": {
                                        "datatype": "string"
                                    }
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-clients-and-grpc-server-clients-cross-config-project",
		ProjectJSON:         restGrpcServerClientsCrossConfigJSON,
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
                        "sqlDB": "MySQL",
                        "port": "4000",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    }
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
                        "sqlDB": "SQLite",
                        "port": "50033",
                        "resources": [
                            {
                                "fields": {
                                    "NameG": {
                                        "datatype": "string"
                                    }
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-client-and-grpc-client-cross-config-project",
		ProjectJSON:         restGrpcClientCrossConfigJSON,
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
                        "sqlDB": "SQLite",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    }
                                },
                                "name": "Student"
                            }
                        ]
                    },
                    "framework": "go-grpc-server",
                    "template": "compage"
                },
                "restConfig": {
                    "server": {
                        "sqlDB": "SQLite",
                        "port": "1337",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    }
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-and-grpc-server-project",
		ProjectJSON:         restAndGrpcServerConfigJSON,
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
                        "sqlDB": "SQLite",
                        "port": "50052",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    }
                                },
                                "name": "Student"
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
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-ws-server-project",
		ProjectJSON:         wsServerConfigJSON,
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

func TestDotNetMVCFrameworkGenerator(t *testing.T) {
	restServerConfigJSON := `{
    "edges": {},
    "nodes": {
        "node-b0": {
            "id": "node-b0",
            "typeId": "node-type-circle",
            "consumerData": {
                "nodeType": "circle",
                "name": "student-service",
                "language": "dotnet",
                "restConfig": {
                    "server": {
                        "sqlDB": "SQLite",
                        "port": "5005",
                        "resources": [
                            {
                                "fields": {
                                    "Name": {
                                        "datatype": "string"
                                    },
                                    "RollNumber": {
                                        "datatype": "int32"
                                    },
                                    "College": {
                                        "datatype": "string"
                                    }
                                },
                                "name": "Student"
                            }
                        ]
                    },
                    "framework": "dotnet-mvc-framework",
                    "template": "compage"
                }
            }
        }
    }
}`
	input := project.GenerateCodeRequest{
		GitPlatformURL:      "https://github.com",
		GitPlatformUserName: "mahendraintelops",
		GitRepositoryName:   "first-project-github",
		ProjectName:         "first-rest-server-project-dotnet",
		ProjectJSON:         restServerConfigJSON,
	}
	defer func() {
		//_ = os.RemoveAll("/tmp/first-rest-server-project-dotnet")
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
