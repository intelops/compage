package utils

import (
	"fmt"
	"os"
	"reflect"
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

func TestGetProjectDirectoryName(t *testing.T) {
	type args struct {
		name string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// TODO: Add test cases.
		{
			name: fmt.Sprintf("By passing value %v, we get root path which is %v", "test", "/tmp/test"),
			args: args{
				name: "test",
			},
			want: "/tmp/test",
		},
		{
			name: fmt.Sprintf("By passing value %v, we get root path which is %v", "", "/tmp/"),
			args: args{
				name: "",
			},
			want: "/tmp/",
		},
		{
			name: fmt.Sprintf("By passing value %v, we get root path which is %v", "main", "/tmp/main"),
			args: args{
				name: "main",
			},
			want: "/tmp/main",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetProjectDirectoryName(tt.args.name); got != tt.want {
				t.Errorf("GetProjectDirectoryName() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestCreateDirectories(t *testing.T) {
	type args struct {
		dirName string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
		{
			name: fmt.Sprintf("Creating directory %v ", "test"),
			args: args{
				dirName: "test",
			},
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Creating Empty Directory %v for negative case", ""),
			args: args{
				dirName: "",
			},
			wantErr: true,
		},
		{
			name: fmt.Sprintf("Creating directory %v ", "compage"),
			args: args{
				dirName: "compage",
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CreateDirectories(tt.args.dirName); (err != nil) != tt.wantErr {
				t.Errorf("CreateDirectories() error = %v, wantErr %v", err, tt.wantErr)
			}
			os.Remove(tt.args.dirName)
		})
	}
}

func TestCopyFiles(t *testing.T) {
	type args struct {
		destDirectory string
		srcDirectory  string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CopyFiles(tt.args.destDirectory, tt.args.srcDirectory); (err != nil) != tt.wantErr {
				t.Errorf("CopyFiles() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestCopyFilesAndDirs(t *testing.T) {
	type args struct {
		destDirectory string
		srcDirectory  string
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CopyFilesAndDirs(tt.args.destDirectory, tt.args.srcDirectory); (err != nil) != tt.wantErr {
				t.Errorf("CopyFilesAndDirs() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestCopyAllInSrcDirToDestDir(t *testing.T) {
	type args struct {
		destDirectory string
		srcDirectory  string
		copyNestedDir bool
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := CopyAllInSrcDirToDestDir(tt.args.destDirectory, tt.args.srcDirectory, tt.args.copyNestedDir); (err != nil) != tt.wantErr {
				t.Errorf("CopyAllInSrcDirToDestDir() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestCopyFile(t *testing.T) {
	type args struct {
		destFilePath string
		srcFilePath  string
	}
	tests := []struct {
		name    string
		args    args
		want    int64
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := CopyFile(tt.args.destFilePath, tt.args.srcFilePath)
			if (err != nil) != tt.wantErr {
				t.Errorf("CopyFile() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("CopyFile() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIgnorablePaths(t *testing.T) {
	type args struct {
		path string
	}
	tests := []struct {
		name string
		args args
		want bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IgnorablePaths(tt.args.path); got != tt.want {
				t.Errorf("IgnorablePaths() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetDirectoriesAndFilePaths(t *testing.T) {
	type args struct {
		templatesPath string
	}
	tests := []struct {
		name    string
		args    args
		want    []string
		want1   []string
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1, err := GetDirectoriesAndFilePaths(tt.args.templatesPath)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetDirectoriesAndFilePaths() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetDirectoriesAndFilePaths() got = %v, want %v", got, tt.want)
			}
			if !reflect.DeepEqual(got1, tt.want1) {
				t.Errorf("GetDirectoriesAndFilePaths() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}
