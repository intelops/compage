package ruby

import (
	"context"
	"github.com/intelops/compage/internal/languages"
)

type contextKey string

func (c contextKey) String() string {
	return string(c)
}

var (
	contextKeyRubyContextVars = contextKey("RubyContextVars")
)

type Values struct {
	Values   *languages.Values
	RubyNode *LRubyNode
}

func AddValuesToContext(ctx context.Context) context.Context {
	values := ctx.Value(languages.ContextKeyLanguageContextVars).(languages.Values)
	v := Values{
		Values: &values,
		RubyNode: &LRubyNode{
			LanguageNode: values.LanguageNode,
		},
	}

	return context.WithValue(ctx, contextKeyRubyContextVars, v)
}
