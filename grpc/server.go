package grpc

import (
	_ "embed"
	project "github.com/intelops/compage/gen/api/v1"
	"github.com/intelops/compage/internal/converter/grpc"
	"github.com/intelops/compage/internal/handlers"
	"github.com/intelops/compage/internal/taroperations"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"io"
	"os"
)

var chunkSize = 1024 * 3

type server struct {
	project.UnimplementedProjectServiceServer
}

func New() project.ProjectServiceServer {
	return &server{}
}

// GenerateCode implements api.v1.GenerateCode
func (s *server) GenerateCode(projectRequest *project.GenerateCodeRequest, server project.ProjectService_GenerateCodeServer) error {
	// converts to core project
	coreProject, err := grpc.GetProject(projectRequest)
	if err != nil {
		log.Errorf("err : %s", err)
		return status.Errorf(codes.InvalidArgument,
			"error while converting request to project ["+err.Error()+"]")
	}

	// triggers project generation, process the request
	if err0 := handlers.Handle(coreProject); err0 != nil {
		log.Errorf("err : %s", err0)
		return status.Errorf(codes.InvalidArgument,
			"error while generating the project ["+err0.Error()+"]")
	}

	// CreateTarFile creates tar file for the project generated
	if err1 := taroperations.CreateTarFile(coreProject.Name, utils.GetProjectDirectoryName(projectRequest.GetProjectName())); err1 != nil {
		log.Errorf("err : %s", err1)
		return status.Errorf(codes.Internal,
			"error while converting request to project ["+err1.Error()+"]")
	}

	// delete tmp/project-name directory
	defer func(name string) {
		if err2 := os.RemoveAll(name); err2 != nil {
			log.Errorf("err : %s", err2)
		}
	}(utils.GetProjectDirectoryName(projectRequest.GetProjectName()))

	// delete just file
	defer func(name string) {
		if err3 := os.Remove(name); err3 != nil {
			log.Errorf("err : %s", err3)
		}
	}(taroperations.GetProjectTarFilePath(projectRequest.GetProjectName()))

	// stream file to grpc client
	return sendFile(projectRequest.ProjectName, server)
}

// RegenerateCode implements api.v1.RegGenerateCode
func (s *server) RegenerateCode(generateCodeRequest *project.GenerateCodeRequest, server project.ProjectService_RegenerateCodeServer) error {
	//projectGrpc, err := grpc.GetProject(generateCodeRequest)
	//if err != nil {
	//	return err
	//}
	//fmt.Println(projectGrpc.CompageJSON)
	// GenerateCode
	err := taroperations.CreateTarFile(generateCodeRequest.ProjectName, utils.GetProjectDirectoryName(generateCodeRequest.GetProjectName()))
	if err != nil {
		log.Errorf("err : %s", err)
		return status.Errorf(codes.InvalidArgument,
			"error while creating a tar file ["+err.Error()+"]")
	}
	return sendFile(generateCodeRequest.ProjectName, server)
}

func sendFile(projectName string, server project.ProjectService_GenerateCodeServer) error {
	f, ok := taroperations.GetFile(taroperations.GetProjectTarFilePath(projectName))
	if !ok {
		return status.Error(codes.NotFound, "file is not found")
	}
	if err := server.SendHeader(f.Metadata()); err != nil {
		return status.Error(codes.Internal, "error during sending header")
	}
	fileChunk := &project.GenerateCodeResponse{FileChunk: make([]byte, chunkSize)}
Loop:
	for {
		n, err := f.Read(fileChunk.FileChunk)
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
