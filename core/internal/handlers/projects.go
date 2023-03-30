package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/intelops/compage/core/internal/converter/rest"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/languages"
	"github.com/intelops/compage/core/internal/processor"
	"github.com/intelops/compage/core/internal/taroperations"
	log "github.com/sirupsen/logrus"
	"net/http"
)

// CallOpenApiGenerator calls OpenApiGenerator
// TODO remove this before release (this was created to test the openapi generator code)
func CallOpenApiGenerator(context *gin.Context) {
	go func() {
		_ = languages.RunOpenApiGenerator("generate", "-i", "https://raw.githubusercontent.com/openapitools/openapi-generator/master/modules/openapi-generator/src/test/resources/3_0/petstore.yaml", "-g", "ruby", "-o", "/tmp/test-project/")
	}()
	context.JSON(http.StatusOK, gin.H{
		"message": "called RunOpenApiGenerator",
	})
}

// Ping ping endpoint
func Ping(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

// GenerateCode creates project and generates code.
func GenerateCode(context *gin.Context) {
	// Validate input
	var input core.ProjectInput
	if err := context.ShouldBindJSON(&input); err != nil {
		log.Errorf("err : %s", err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// retrieve project struct
	project, err0 := rest.GetProject(input)
	if err0 != nil {
		log.Errorf("err : %s", err0)
		context.JSON(http.StatusInternalServerError, gin.H{"error": err0.Error()})
		return
	}
	// trigger project generation
	if err1 := processor.Process(project); err1 != nil {
		log.Errorf("err : %s", err1)
		context.JSON(http.StatusInternalServerError, gin.H{"error": err1.Error()})
		return
	}

	//context.JSON(http.StatusOK, gin.H{
	//	"message": "generateCode" + input.User,
	//})
	context.FileAttachment(taroperations.GetProjectTarFilePath(project.Name), taroperations.GetProjectTarFilePath(project.Name))
}

// RegenerateCode updates project and generates code.
func RegenerateCode(context *gin.Context) {
	// Validate input
	var input core.ProjectInput
	if err := context.ShouldBindJSON(&input); err != nil {
		log.Errorf("err : %s", err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Start regenerate-project flow
	fmt.Println("input.User : ", input.UserName)
	context.JSON(http.StatusOK, gin.H{
		"message": "RegenerateCode" + input.UserName,
	})
}
