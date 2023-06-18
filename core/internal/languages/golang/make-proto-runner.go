package golang

import (
	"bytes"
	"fmt"
	log "github.com/sirupsen/logrus"
	"os/exec"
)

// RunMakeProto runs protoc with args passed on generated code present in the directory passed.
func RunMakeProto(directoryName string) error {
	protocCommand := "protoc"
	makeCommand := "make"
	makeSubCommand := "proto"
	if commandExists(protocCommand) {
		if commandExists(makeCommand) {
			args := []string{makeSubCommand}
			command := exec.Command(makeCommand, args...)
			command.Dir = directoryName
			var stdErr bytes.Buffer
			command.Stderr = &stdErr
			var stdOut bytes.Buffer
			command.Stdout = &stdOut
			if err := command.Run(); err != nil {
				log.Debugf("err : %s", err)
				log.Debugf("stdOut: %s\n", stdOut.String())
				log.Debugf("stdErr: %s\n", stdErr.String())
				return err
			}
			log.Debugf("stdOut: %s\n", stdOut.String())
			log.Debugf("stdErr: %s\n", stdErr.String())
			return nil
		} else {
			return fmt.Errorf("%s command doesn't exist", makeCommand)
		}
	}
	return fmt.Errorf("%s command doesn't exist", protocCommand)
}

// as util
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}
