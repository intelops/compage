package utils

import "testing"

func TestGetProjectRootPath(t *testing.T) {
	type args struct {
		templatesPath string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := GetProjectRootPath(tt.args.templatesPath); got != tt.want {
				t.Errorf("GetProjectRootPath() = %v, want %v", got, tt.want)
			}
		})
	}
}
