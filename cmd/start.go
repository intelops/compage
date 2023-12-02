package cmd

import (
	"context"
	"github.com/intelops/compage/config"
	project "github.com/intelops/compage/gen/api/v1"
	server "github.com/intelops/compage/grpc"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"
	"golang.org/x/exp/slices"
)

var (
	serviceName  = os.Getenv("SERVICE_NAME")
	collectorURL = os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
	insecure     = os.Getenv("INSECURE_MODE")
)

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Starts the gRPC server",
	Long: `Compage is a grpc server that generates code for various languages.

This command will start thr gRPC server and allow the gRPC clients to get connected with it. The gRPC server will be listening on port 50051. Make sure that the git submodules are pulled.`,
	Run: func(cmd *cobra.Command, args []string) {
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

		err := CloneOrPullRepository("common")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("go")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("python")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("java")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("javascript")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("ruby")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("rust")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("typescript")
		cobra.CheckErr(err)
		err = CloneOrPullRepository("dotnet")
		cobra.CheckErr(err)

		// check if the git submodules have been pulled (mainly need to check this on developer's machine)
		if checkIfGitSubmodulesExist() {
			err = startGrpcServer()
			cobra.CheckErr(err)
		} else {
			log.Error("starting gRPC server failed as git submodules don't exist")
		}
	},
}

func init() {
	rootCmd.AddCommand(startCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// startCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// startCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

func checkIfGitSubmodulesExist() bool {
	// currently available templates
	templates := []string{"common-templates", "compage-template-go", "compage-template-java", "compage-template-python", "compage-template-javascript", "compage-template-ruby", "compage-template-rust", "compage-template-typescript"}

	// read the templates directory and list down files in it.
	baseTemplateRootPath, err := utils.GetBaseTemplateRootPath()
	if err != nil {
		log.Error("error while getting base template root path [" + err.Error() + "]")
		return false
	}
	files, err := os.ReadDir(baseTemplateRootPath)
	if err != nil {
		log.Error("error while reading templates directory [" + err.Error() + "]")
		return false
	}
	// iterate over files in templates directory
	for _, file := range files {
		// check if the item in templates directory is directory,
		// and it's a valid template (by looking into available templates)
		if file.IsDir() && slices.Contains(templates, file.Name()) {
			// check in specific template directory.
			filesInDir, err0 := os.ReadDir(baseTemplateRootPath + "/" + file.Name())
			if err0 != nil {
				log.Error("error while reading templates directory [" + err0.Error() + "]")
				return false
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

func startGrpcServer() error {
	listener, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Errorf("failed to listen: %v", err)
		return err
	}
	log.Println("started gRPC server on '0.0.0.0:50051'")
	grpcServer := grpc.NewServer(grpc.StatsHandler(otelgrpc.NewServerHandler()))
	// uncomment below lines if the above line doesn't work
	//grpcServer := grpc.NewServer(grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
	//	grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()))
	impl := server.New()
	project.RegisterProjectServiceServer(grpcServer, impl)
	reflection.Register(grpcServer)

	go func() {
		if err = grpcServer.Serve(listener); err != nil {
			log.Errorf("failed to serve: %v", err)
			return
		}
	}()

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-done
	grpcServer.GracefulStop()
	log.Printf("Server stopped")
	return nil
}
