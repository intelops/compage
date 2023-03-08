package golang

import (
	"github.com/intelops/compage/core/internal/languages"
)

// GoNode language specific struct.
type GoNode struct {
	languages.LanguageNode
}

// FillDefaults constructor function
func (goNode *GoNode) FillDefaults() error {
	return nil
}
