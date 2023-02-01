package main

import (
	"fmt"
	server "github.com/kube-tarian/compage/core/cmd/grpc"
	project "github.com/kube-tarian/compage/core/gen/api/v1"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"net"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	//fmt.Println("starting rest server...")
	//if err := rest.StartRestServer(); err != nil {
	//	log.Fatalf("failed to serve: %v", err)
	//}

	fmt.Println("starting gRPC server...")
	startGrpcServer()
}

func startGrpcServer() {
	listener, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	var opts []grpc.ServerOption

	grpcServer := grpc.NewServer(opts...)
	impl := server.New()
	project.RegisterProjectServiceServer(grpcServer, impl)
	reflection.Register(grpcServer)

	go func() {
		if err := grpcServer.Serve(listener); err != nil {
			log.Printf("grpcServer.Serve: %v", err)
		}
	}()

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-done
	grpcServer.GracefulStop()
	log.Printf("Server stopped")
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
	log.SetLevel(log.DebugLevel)
}
