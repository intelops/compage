package golang

import (
	log "github.com/sirupsen/logrus"
	"os/exec"
)

// RunMakeProto runs protoc with args passed on generated code present in the directory passed.
func RunMakeProto(directoryName string) error {
	args := []string{"proto"}
	command := exec.Command("make", args...)
	command.Dir = directoryName

	if err := command.Run(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}
	return nil
}
