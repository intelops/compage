package utils

import (
	"path/filepath"
	"runtime"
)

var (
	_, b, _, _ = runtime.Caller(0)

	// root directory of this project
	root = filepath.Join(filepath.Dir(b), "../..")
)

// GetProjectRootPath returns a root path of the language template passed.
func GetProjectRootPath(templatesPath string) string {
	return root + "/" + templatesPath
}
