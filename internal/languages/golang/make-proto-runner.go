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
				log.Errorf("%s\n", err)
				log.Errorf("%s\n", stdOut.String())
				log.Errorf("%s\n", stdErr.String())
				return err
			}
			if len(stdErr.String()) > 0 {
				log.Debugf("%s\n", stdErr.String())
			}
			if len(stdOut.String()) > 0 {
				log.Debugf("%s\n", stdOut.String())
			}
			return nil
		} else {
			return fmt.Errorf("%s command doesn't exist", makeCommand)
		}
	}
	return fmt.Errorf("%s command doesn't exist", protocCommand)
}
