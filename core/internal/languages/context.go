package languages

import (
	"context"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/utils"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	ContextKeyLanguageContextVars = contextKey("LanguageContextVars")
)

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
	LanguageNode      *LanguageNode
}

func (v Values) Get(key TemplateVarKey) string {
	return v.TemplateVars[key]
}

func AddValuesToContext(ctx context.Context, project *core.Project, languageNode *LanguageNode) context.Context {

	// retrieve project named directory
	projectDirectory := utils.GetProjectDirectoryName(project.Name)

	// create node directory in projectDirectory depicting a subproject
	nodeDirectoryName := projectDirectory + "/" + languageNode.Name

	v := Values{
		TemplateVars: map[TemplateVarKey]string{
			RepositoryName: project.RepositoryName,
			NodeName:       languageNode.Name,
			UserName:       project.UserName,
		},
		NodeDirectoryName: nodeDirectoryName,
		ProjectName:       project.Name,
		LanguageNode:      languageNode,
	}

	return context.WithValue(ctx, ContextKeyLanguageContextVars, v)
}
