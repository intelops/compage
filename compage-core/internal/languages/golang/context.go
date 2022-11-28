package golang

import (
	"context"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/utils"
)

const ContextVars = "ContextVars"

type TemplateVarKey string

const (
	RepositoryName TemplateVarKey = "RepositoryName"
	NodeName       TemplateVarKey = "NodeName"
	UserName       TemplateVarKey = "UserName"
)

type Values struct {
	TemplateVars      map[TemplateVarKey]string
	ProjectName       string
	NodeDirectoryName string
	GoNode            *GoNode
}

func (v Values) Get(key TemplateVarKey) string {
	return v.TemplateVars[key]
}

func AddValuesToContext(ctx context.Context, project *core.Project, goNode *GoNode) context.Context {

	// retrieve project named directory
	projectDirectory := utils.GetProjectDirectoryName(project.Name)

	// create node directory in projectDirectory depicting a subproject
	nodeDirectoryName := projectDirectory + "/" + goNode.Name

	v := Values{
		TemplateVars: map[TemplateVarKey]string{
			RepositoryName: project.RepositoryName,
			NodeName:       goNode.Name,
			UserName:       project.UserName,
		},
		NodeDirectoryName: nodeDirectoryName,
		ProjectName:       project.Name,
		GoNode:            goNode,
	}

	return context.WithValue(ctx, ContextVars, v)
}
