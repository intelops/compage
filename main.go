package main

import (
	"context"
	server "github.com/intelops/compage/cmd/grpc"
	"github.com/intelops/compage/config"
	project "github.com/intelops/compage/gen/api/v1"
	log "github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"golang.org/x/exp/slices"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	"net"
	"os"
	"os/signal"
	"syscall"
)

var (
	serviceName  = os.Getenv("SERVICE_NAME")
	collectorURL = os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	insecure     = os.Getenv("INSECURE_MODE")
)

func main() {
	// grpc server configuration
	// Initializes the exporter
	var grpcTraceProvider *sdktrace.TracerProvider
	if len(serviceName) > 0 && len(collectorURL) > 0 {
		// add open telemetry tracing
		grpcTraceProvider = config.InitGrpcTracer(serviceName, collectorURL, insecure)
	}
	defer func() {
		if grpcTraceProvider != nil {
			if err := grpcTraceProvider.Shutdown(context.Background()); err != nil {
				log.Printf("Error shutting down tracer provider: %v", err)
			}
		}
	}()

	// check if the git submodules have been pulled (mainly need to check this on developer's machine)
	if checkIfGitSubmodulesExist() {
		log.Println("starting gRPC server...")
		startGrpcServer()
	} else {
		log.Error("starting gRPC server failed as git submodules don't exist")
	}
}

func checkIfGitSubmodulesExist() bool {
	templatesPath := "templates"
	// currently available templates
	templates := []string{"compage-templates", "compage-template-go", "compage-template-java", "compage-template-python", "compage-template-javascript", "compage-template-ruby", "compage-template-rust", "compage-template-typescript"}
	// read the templates directory and list down files in it.
	files, err := os.ReadDir(templatesPath)
	if err != nil {
		log.Fatal(err)
	}
	// iterate over files in templates directory
	for _, file := range files {
		// check if the item in templates directory is directory,
		// and it's a valid template (by looking into available templates)
		if file.IsDir() && slices.Contains(templates, file.Name()) {
			// check in specific template folder.
			filesInDir, err0 := os.ReadDir(templatesPath + "/" + file.Name())
			if err0 != nil {
				log.Fatal(err0)
			}
			// if there are no directories or files in specific template, this means that the `git submodules update --remote` command wasn't fired before.
			if len(filesInDir) <= 0 {
				log.Info(file.Name() + " template have not been pulled. Please fire `git submodule init` and then `git submodule update --remote`.")
				return false
			}
		}
	}
	return true
}

func startGrpcServer() {
	listener, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

	grpcServer := grpc.NewServer(grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
		grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()))
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
	// log as JSON instead of the default ASCII formatter.
	// log.SetFormatter(&log.JSONFormatter{})
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
