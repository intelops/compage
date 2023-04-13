package test

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/intelops/compage/core/internal/utils"
)

func TestGetProjectRootPath(t *testing.T) {
	type TestCases struct {
		name   string
		result string
	}
	testcases := []TestCases{
		{
			name:   "test",
			result: "/home/dell/Desktop/intelops/compage/core/test",
		},
		{
			name:   "",
			result: "/home/dell/Desktop/intelops/compage/core/",
		},
		{
			name:   "main",
			result: "/home/dell/Desktop/intelops/compage/core/main",
		},
	}
	for _, testcase := range testcases {
		t.Run(fmt.Sprintf("By passing value %v\t, we get root path which is %v\n", testcase.name, testcase.result), func(t *testing.T) {
			res := utils.GetProjectRootPath(testcase.name)
			if testcase.result != res {
				t.Fatalf("We've expected %v\t, but got %v\n", testcase.result, res)
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
			if got := utils.GetProjectDirectoryName(tt.args.name); got != tt.want {
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
			if err := utils.CreateDirectories(tt.args.dirName); (err != nil) != tt.wantErr {
				t.Errorf("CreateDirectories() error = %v, wantErr %v", err, tt.wantErr)
			}
			time.Sleep(5 * time.Second)
			os.Remove(tt.args.dirName)
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
		{
			name: fmt.Sprintf("IgnorablePaths() = %v, want %v", "page.idea", "true"),
			args: args{
				path: "page.idea",
			},
			want: true,
		},
		{
			name: fmt.Sprintf("IgnorablePaths() = %v, want %v", "temp/page.idea", "true"),
			args: args{
				path: "temp/page.idea",
			},
			want: true,
		},
		{
			name: fmt.Sprintf("IgnorablePaths() = %v, want %v", ".gitignore", "true"),
			args: args{
				path: ".gitignore",
			},
			want: true,
		},
		{
			name: fmt.Sprintf("IgnorablePaths() = %v, want %v", "index.js", "false"),
			args: args{
				path: "index.js",
			},
			want: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := utils.IgnorablePaths(tt.args.path); got != tt.want {
				t.Errorf("IgnorablePaths() = %v, want %v", got, tt.want)
			}
		})
	}
}
