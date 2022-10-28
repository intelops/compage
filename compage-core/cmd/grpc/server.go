package grpc

import (
	"context"
	"fmt"
	"github.com/kube-tarian/compage-core/cmd/grpc/project"
	"github.com/kube-tarian/compage-core/internal/converter/grpc"
	log "github.com/sirupsen/logrus"
	goGrpc "google.golang.org/grpc"
	"net"
	"os"
)

type server struct {
	project.UnimplementedProjectServiceServer
}

func StartGrpcServer() error {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "50051"
	}
	lis, err := net.Listen("tcp", "0.0.0.0:"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := goGrpc.NewServer()
	project.RegisterProjectServiceServer(s, &server{})
	return s.Serve(lis)
}

// CreateProject implements project.CreateProject
func (s *server) CreateProject(ctx context.Context, in *project.ProjectRequest) (*project.ProjectResponse, error) {
	projectGrpc, err := grpc.GetProject(in)
	if err != nil {
		return nil, err
	}
	fmt.Println(projectGrpc.CompageYaml)
	return &project.ProjectResponse{Name: projectGrpc.Name, FileChunk: []byte(projectGrpc.Repository)}, nil
}

// UpdateProject implements project.UpdateProject
func (s *server) UpdateProject(ctx context.Context, in *project.ProjectRequest) (*project.ProjectResponse, error) {
	projectGrpc, err := grpc.GetProject(in)
	if err != nil {
		return nil, err
	}
	fmt.Println(projectGrpc.CompageYaml)
	return &project.ProjectResponse{Name: projectGrpc.Name, FileChunk: []byte(projectGrpc.Repository)}, nil
}
