package java

import (
	"context"
	"github.com/intelops/compage/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyJavaContextVars = contextKey("JavaContextVars")
)

type Values struct {
	Values   *languages.Values
	JavaNode *LJavaNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		JavaNode: &LJavaNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyJavaContextVars, v)
}
