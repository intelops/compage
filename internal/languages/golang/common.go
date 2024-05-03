package golang

import "os/exec"

// commandExists checks if a command exists in the system.
// cmd: the command to check.
// bool: true if the command exists, false otherwise.
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}
