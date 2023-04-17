package test

import (
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"runtime"
	"testing"
	"time"

	"github.com/intelops/compage/core/internal/utils"
)

var (
	_, b, _, _ = runtime.Caller(0)

	// root folder of this project
	root = filepath.Join(filepath.Dir(b), "../..")
)

func TestGetProjectRootPath(t *testing.T) {
	type TestCases struct {
		name   string
		result string
	}
	testcases := []TestCases{
		{
			name:   "test",
			result: root + "/core/test",
		},
		{
			name:   "",
			result: root + "/core/",
		},
		{
			name:   "main",
			result: root + "/core/main",
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
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "api/v1"),
			args: args{
				destDirectory: "./copy",
				srcDirectory:  "../api/v1/",
			},
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "api/v1"),
			args: args{
				destDirectory: "../../testcopy",
				srcDirectory:  "../api/v1/",
			},
			wantErr: false,
		},
		{
			// Negative case
			name: fmt.Sprintf("Throws an error as the folder is %v ", "Empty"),
			args: args{
				destDirectory: "",
				srcDirectory:  "",
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := utils.CopyFiles(tt.args.destDirectory, tt.args.srcDirectory); (err != nil) != tt.wantErr {
				t.Errorf("CopyFiles() error = %v, wantErr %v", err, tt.wantErr)
			}
			// Added a sleep before
			time.Sleep(5 * time.Second)
			os.RemoveAll(tt.args.destDirectory)
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
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "api/v1"),
			args: args{
				destDirectory: "./copy",
				srcDirectory:  "../api/",
			},
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "api/v1"),
			args: args{
				destDirectory: "../testcopy",
				srcDirectory:  "../api/",
			},
			wantErr: false,
		},
		{
			// Negative case
			name: fmt.Sprintf("Throws an error as the folder is %v ", "Empty"),
			args: args{
				destDirectory: "",
				srcDirectory:  "",
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := utils.CopyFilesAndDirs(tt.args.destDirectory, tt.args.srcDirectory); (err != nil) != tt.wantErr {
				t.Errorf("CopyFilesAndDirs() error = %v, wantErr %v", err, tt.wantErr)
			}
			// Added a sleep before
			if tt.args.destDirectory != "" || tt.args.srcDirectory != "" {
				time.Sleep(5 * time.Second)
				os.RemoveAll(tt.args.destDirectory)
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
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "root/internal"),
			args: args{
				destDirectory: "./copy",
				srcDirectory:  "../internal/",
				copyNestedDir: true,
			},
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Testing the copy files from %v ", "rootpath"),
			args: args{
				destDirectory: "../testcopy",
				srcDirectory:  "../",
				copyNestedDir: false,
			},
			wantErr: false,
		},
		{
			// Negative case
			name: fmt.Sprintf("Throws an error as the folder is %v ", "Empty"),
			args: args{
				destDirectory: "",
				srcDirectory:  "",
				copyNestedDir: false,
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := utils.CopyAllInSrcDirToDestDir(tt.args.destDirectory, tt.args.srcDirectory, tt.args.copyNestedDir); (err != nil) != tt.wantErr {
				t.Errorf("CopyAllInSrcDirToDestDir() error = %v, wantErr %v", err, tt.wantErr)
			}
			if tt.args.destDirectory != "" || tt.args.srcDirectory != "" {
				time.Sleep(5 * time.Second)
				os.RemoveAll(tt.args.destDirectory)
			}
		})
	}
}

func TestCopyFile(t *testing.T) {
	// Function helps to convert file to no of bytes
	countBytes := func(path string) int64 {

		info, err := os.Stat(path)
		if err != nil {
			return -1
		}
		return int64(info.Size())
	}
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
		{
			name: fmt.Sprintf("Testing the copy file from %v ", "api/v1"),
			args: args{
				destFilePath: "./project.proto",
				srcFilePath:  "../api/v1/project.proto",
			},
			want:    countBytes("../api/v1/project.proto"),
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Testing the copy file from %v ", "api/v1"),
			args: args{
				destFilePath: "../project.proto",
				srcFilePath:  "../api/v1/project.proto",
			},
			want:    countBytes("../api/v1/project.proto"),
			wantErr: false,
		},
		{
			// Negative case
			name: fmt.Sprintf("Throws an error as the folder is %v ", "Empty"),
			args: args{
				destFilePath: "",
				srcFilePath:  "",
			},
			want:    0,
			wantErr: true,
		},
		{
			// Negative case
			name: fmt.Sprintf("Throws an error as the folder is %v ", "Empty"),
			args: args{
				destFilePath: "./copy.txt",
				srcFilePath:  "",
			},
			want:    0,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := utils.CopyFile(tt.args.destFilePath, tt.args.srcFilePath)
			if (err != nil) != tt.wantErr {
				t.Errorf("CopyFile() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("CopyFile() = %v, want %v", got, tt.want)
			}
			if tt.want == -1 {
				t.Errorf("Error occurred while reading file %v", tt.args.srcFilePath)
			}
			if tt.args.destFilePath != "" || tt.args.srcFilePath != "" {
				time.Sleep(5 * time.Second)
				os.RemoveAll(tt.args.destFilePath)
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


func TestGetDirectoriesAndFilePaths(t *testing.T) {
	contains := func(filePaths []string, filePathName string) bool {
		for _, f := range filePaths {
			if f == filePathName {
				return true
			}
		}
		return false
	}
	getDirectoriesAndFilePaths := func (templatesPath string) ([]string, []string, error)  {
	var directories []string
	var filePaths []string

	// Get all directories on /templates and check if there's repeated files
	err := filepath.Walk(templatesPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			// Is file
			filename := info.Name()
			hasRepeatedFilePaths := contains(filePaths, path)
			if hasRepeatedFilePaths {
				return fmt.Errorf("you can't have repeated template files: %s", filename)
			}
			filePaths = append(filePaths, path)
		} else {
			// Is directory
			directories = append(directories, path)
		}

		return nil
	})
	return directories, filePaths, err
	}
	type args struct {
		templatesPath string
	}
	type arr struct{
		strArr []string
		strArr1 []string
	}
	paths := []string{
		"../test",
		"../api/v1",
		"",
	}
	var testCases []arr;
	for _, path := range paths{
		dir, fp , _ := getDirectoriesAndFilePaths(path)
		testCases = append(testCases, arr{
				strArr: dir,
				strArr1: fp,
		})
	}

	// fmt.Println(s1, s2)
	tests := []struct {
		name    string
		args    args
		want    []string
		want1   []string
		wantErr bool
	}{
		// TODO: Add test cases.
		{
			name: fmt.Sprintf("Checks the folder is %v ", paths[0]),
			args: args{
				templatesPath: paths[0],
			},
			want: testCases[0].strArr,
			want1: testCases[0].strArr1,
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Throws an error as the folder is %v ", paths[1]),
			args: args{
				templatesPath: paths[1],
			},
			want: testCases[1].strArr,
			want1: testCases[1].strArr1,
			wantErr: false,
		},
		{
			name: fmt.Sprintf("Throws an error as the folder is %v ", paths[2]),
			args: args{
				templatesPath: paths[2],
			},
			want: testCases[2].strArr,
			want1: testCases[2].strArr1,
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1, err := utils.GetDirectoriesAndFilePaths(tt.args.templatesPath)
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
