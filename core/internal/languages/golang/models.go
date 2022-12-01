package golang

import (
	"github.com/kube-tarian/compage/core/internal/languages"
)

// GoNode language specific struct.
type GoNode struct {
	languages.LanguageNode
}

// FillDefaults constructor function
func (goNode *GoNode) FillDefaults() error {
	return nil
}
