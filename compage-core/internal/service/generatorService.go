package service

import (
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/generator"
)

// Generator called from rest as well as gRPC
func Generator(project *core.Project) error {
	// trigger project generation
	return generator.Generate(project)
}
