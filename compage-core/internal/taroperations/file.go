package taroperations

import (
	"io"
)

// File holds file information.
type File struct {
	r         io.Reader
	Name      string
	Extension string
	Size      int
}

// NewFile returns file.
func NewFile(name string, extension string, size int, r io.Reader) *File {
	return &File{Name: name, Extension: extension, Size: size, r: r}
}

func (f *File) Read(p []byte) (n int, err error) {
	return f.r.Read(p)
}
