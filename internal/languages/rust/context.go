package rust

import (
	"context"
	"github.com/intelops/compage/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyRustContextVars = contextKey("RustContextVars")
)

type Values struct {
	Values   *languages.Values
	RustNode *LRustNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		RustNode: &LRustNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyRustContextVars, v)
}
