package javascript

import (
	"context"
	"github.com/intelops/compage/core/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyJavaScriptContextVars = contextKey("JavaScriptContextVars")
)

type Values struct {
	Values         *languages.Values
	JavaScriptNode *LJavaScriptNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		JavaScriptNode: &LJavaScriptNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyJavaScriptContextVars, v)
}
