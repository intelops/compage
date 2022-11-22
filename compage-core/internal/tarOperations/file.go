package tarOperations

import (
	"io"
)

func NewFile(name string, extension string, size int, r io.Reader) *File {
	return &File{Name: name, Extension: extension, Size: size, r: r}
}

type File struct {
	r         io.Reader
	Name      string
	Extension string
	Size      int
}

func (f *File) Read(p []byte) (n int, err error) {
	return f.r.Read(p)
}
