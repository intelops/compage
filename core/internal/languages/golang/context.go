package golang

import (
	"context"
	"github.com/intelops/compage/core/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyGoContextVars = contextKey("GoContextVars")
)

type GoValues struct {
	Values      *languages.Values
	LGoLangNode *LGolangNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := GoValues{
		Values: &values,
		LGoLangNode: &LGolangNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyGoContextVars, v)
}
