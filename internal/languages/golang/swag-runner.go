package golang

import (
	"bytes"
	"fmt"
	"os/exec"

	log "github.com/sirupsen/logrus"
)

// RunSwag runs swag with args passed on generated code present in the directory passed.
func RunSwag(directoryName string) error {
	swagCommand := "swag"
	if commandExists(swagCommand) {
		args := []string{"init", "--parseDependency", "--parseInternal"}
		command := exec.Command(swagCommand, args...)
		command.Dir = directoryName
		var stdErr bytes.Buffer
		command.Stderr = &stdErr
		var stdOut bytes.Buffer
		command.Stdout = &stdOut
		if err := command.Run(); err != nil {
			log.Errorf("%s\n", err)
			log.Errorf("%s\n", stdErr.String())
			log.Errorf("%s\n", stdOut.String())
			return err
		}
		if len(stdErr.String()) > 0 {
			log.Errorf("%s\n", stdErr.String())
		}
		if len(stdOut.String()) > 0 {
			log.Infof("%s\n", stdOut.String())
		}
		return nil
	} else {
		return fmt.Errorf("%s command doesn't exist. Please install swag using https://github.com/swaggo/swag?tab=readme-ov-file#getting-started.\nInstalled, and still facing issue? Please check https://github.com/swaggo/swag/issues/197", swagCommand)
	}
}
