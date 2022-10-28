package grpc

import (
	"bytes"
	_ "embed"
	"fmt"
	project "github.com/kube-tarian/compage-core/gen/api/v1"
	"github.com/kube-tarian/compage-core/internal/converter/grpc"
	"github.com/kube-tarian/compage-core/internal/file"
	"io"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//go:embed static/gopher.png
var gopher []byte

var chunkSize = 1024 * 3

type server struct {
	project.UnimplementedProjectServiceServer
}

func New() project.ProjectServiceServer {
	return server{}
}

// CreateProject implements api.v1.CreateProject
func (s server) CreateProject(projectRequest *project.ProjectRequest, server project.ProjectService_CreateProjectServer) error {
	projectGrpc, err := grpc.GetProject(projectRequest)
	if err != nil {
		return err
	}
	fmt.Println(projectGrpc.CompageYaml)
	// createProject
	// create tar file

	return sendFile(projectRequest, server)
}

// UpdateProject implements api.v1.UpdateProject
func (s server) UpdateProject(projectRequest *project.ProjectRequest, server project.ProjectService_UpdateProjectServer) error {
	projectGrpc, err := grpc.GetProject(projectRequest)
	if err != nil {
		return err
	}
	fmt.Println(projectGrpc.CompageYaml)
	// createProject
	// create tar file

	return sendFile(projectRequest, server)
}

func getFile(fileName string) (*file.File, bool) {
	if fileName != "gopher" {
		return nil, false
	}
	return file.NewFile("gopher", "png", len(gopher), bytes.NewReader(gopher)), true
}

func sendFile(projectRequest *project.ProjectRequest, server project.ProjectService_CreateProjectServer) error {
	f, ok := getFile(projectRequest.ProjectName)
	if !ok {
		return status.Error(codes.NotFound, "file is not found")
	}
	err := server.SendHeader(f.Metadata())
	if err != nil {
		return status.Error(codes.Internal, "error during sending header")
	}
	fileChunk := &project.ProjectResponse{FileChunk: make([]byte, chunkSize)}
	var n int
Loop:
	for {
		n, err = f.Read(fileChunk.FileChunk)
		switch err {
		case nil:
		case io.EOF:
			break Loop
		default:
			return status.Errorf(codes.Internal, "io.ReadAll: %v", err)
		}
		fileChunk.FileChunk = fileChunk.FileChunk[:n]
		serverErr := server.Send(fileChunk)
		if serverErr != nil {
			return status.Errorf(codes.Internal, "server.Send: %v", serverErr)
		}
	}
	return nil
}
