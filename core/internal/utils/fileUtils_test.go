package utils

import (
	"fmt"
	"testing"
)

func Test_contains(t *testing.T) {
	type args struct {
		filePaths    []string
		filePathName string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		// TODO: Add test cases.
		{
			name: fmt.Sprintf("Checking if %v contains in the given filepaths", "main.go"),
			args: args{
				filePaths:    []string{"compage", "main.go", ".temp"},
				filePathName: "main.go",
			},
			want: true,
		},
		{
			name: fmt.Sprintf("Checking if %v contains in the given filepaths", ".temp"),
			args: args{
				filePaths:    []string{"compage", "main.go", ".temp"},
				filePathName: ".temp",
			},
			want: true,
		},
		{
			name: fmt.Sprintf("Checking if %v contains in the given filepaths", "main"),
			args: args{
				filePaths:    []string{"compage", "main.go", ".temp"},
				filePathName: "main",
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := contains(tt.args.filePaths, tt.args.filePathName); got != tt.want {
				t.Errorf("contains() = %v, want %v", got, tt.want)
			}
		})
	}
}
