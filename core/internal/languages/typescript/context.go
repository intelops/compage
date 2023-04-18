package typescript

import (
	"context"
	"github.com/intelops/compage/core/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyTypeScriptContextVars = contextKey("TypeScriptContextVars")
)

type Values struct {
	Values         *languages.Values
	TypeScriptNode *LTypeScriptNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		TypeScriptNode: &LTypeScriptNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyTypeScriptContextVars, v)
}
