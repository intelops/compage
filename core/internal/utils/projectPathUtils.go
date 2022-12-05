package utils

import (
	"path/filepath"
	"runtime"
)

var (
	_, b, _, _ = runtime.Caller(0)

	// root folder of this project
	root = filepath.Join(filepath.Dir(b), "../..")
)

// GetProjectRootPath returns root path of golang project.
func GetProjectRootPath() string {
	return root + "/" + GolangTemplatesPath
}
