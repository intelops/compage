package main

import (
	"fmt"
	"github.com/kube-tarian/compage-core/cmd/grpc"
	log "github.com/sirupsen/logrus"
	"os"
)

func main() {
	//fmt.Println("starting rest server...")
	//if err := rest.StartRestServer(); err != nil {
	//log.Fatalf("failed to serve: %v", err)
	//}

	fmt.Println("starting gRPC server...")
	if err := grpc.StartGrpcServer(); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func init() {
	// Log as JSON instead of the default ASCII formatter.
	//log.SetFormatter(&log.JSONFormatter{})
	log.SetFormatter(&log.TextFormatter{
		DisableColors: false,
		FullTimestamp: true,
	})
	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example
	log.SetOutput(os.Stdout)
	// Only log the warning severity or above.
	log.SetLevel(log.InfoLevel)
}
