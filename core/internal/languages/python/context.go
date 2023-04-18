package python

import (
	"context"
	"github.com/intelops/compage/core/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyPythonContextVars = contextKey("PythonContextVars")
)

type Values struct {
	Values     *languages.Values
	PythonNode *LPythonNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		PythonNode: &LPythonNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyPythonContextVars, v)
}
