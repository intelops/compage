package grpc

import (
	"bytes"
	_ "embed"
	"github.com/kube-tarian/compage-core/cmd/grpc/file"
	project "github.com/kube-tarian/compage-core/gen/api/v1"
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

func (s server) CreateProject(req *project.ProjectRequest, server project.ProjectService_CreateProjectServer) error {
	if req.GetName() == "" {
		return status.Error(codes.InvalidArgument, "Name is required")
	}

	f, ok := getFile(req.Name)
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

func getFile(fileName string) (*file.File, bool) {
	if fileName != "gopher" {
		return nil, false
	}
	return file.NewFile("gopher", "png", len(gopher), bytes.NewReader(gopher)), true
}

//// UpdateProject implements project.UpdateProject
//func (s server) UpdateProject(ctx context.Context, in *project.ProjectRequest) (*project.ProjectResponse, error) {
//	projectGrpc, err := compageGrpc.GetProject(in)
//	if err != nil {
//		return nil, err
//	}
//	fmt.Println(projectGrpc.CompageYaml)
//
//	return &project.ProjectResponse{FileChunk: []byte(projectGrpc.Repository)}, nil
//}
