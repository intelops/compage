package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/kube-tarian/compage-core/internal/converter/rest"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/service"
	"github.com/kube-tarian/compage-core/internal/utils"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func Ping(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func CreateProject(context *gin.Context) {
	// Validate input
	var input core.ProjectInput
	if err := context.ShouldBindJSON(&input); err != nil {
		log.Error(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// retrieve project struct
	project, err := rest.GetProject(input)
	if err != nil {
		log.Error(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// trigger project generation
	if err := service.Generator(project); err != nil {
		log.Error(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//context.JSON(http.StatusOK, gin.H{
	//	"message": "generateProject" + input.User,
	//})
	context.FileAttachment(utils.GetTarFilePath(project.Name), utils.GetTarFilePath(project.Name))
}

func UpdateProject(context *gin.Context) {
	// Validate input
	var input core.ProjectInput
	if err := context.ShouldBindJSON(&input); err != nil {
		log.Error(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Start regenerate-project flow
	fmt.Println("input.User : ", input.UserName)
	context.JSON(http.StatusOK, gin.H{
		"message": "UpdateProject" + input.UserName,
	})
}
