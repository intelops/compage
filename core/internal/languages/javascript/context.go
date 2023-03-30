package javascript

import (
	"context"
	"github.com/intelops/compage/core/internal/languages"
)

const ContextVars = "ContextVars"

type Values struct {
	Values         *languages.Values
	JavaScriptNode *LJavaScriptNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.LanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		JavaScriptNode: &LJavaScriptNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, ContextVars, v)
}
