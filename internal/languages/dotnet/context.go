package dotnet

import (
	"context"
	"github.com/intelops/compage/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyDotNetContextVars = contextKey("DotNetContextVars")
)

type DotNetValues struct {
	Values          *languages.Values
	LDotNetLangNode *LDotNetLangNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := DotNetValues{
		Values: &values,
		LDotNetLangNode: &LDotNetLangNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyDotNetContextVars, v)
}
