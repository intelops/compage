package server

import (
	"github.com/gin-gonic/gin"
	"github.com/kube-tarian/compage-core/internal/handlers"
)

func StartRestServer() error {
	router := gin.Default()
	err := router.SetTrustedProxies([]string{"192.168.1.0"})
	if err != nil {
		return err
	}
	router.GET("/ping", handlers.Ping)
	router.POST("/create_project", handlers.CreateProject)
	router.PUT("/update_project", handlers.UpdateProject)
	return router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
