package generator

import (
	log "github.com/sirupsen/logrus"
	"os/exec"
)

// RunGoFmt runs go-fmt with args passed on generated code present in the directory passed.
func RunGoFmt(directoryName string) error {
	args := []string{"-s", "-w", directoryName}
	output, err := exec.Command("gofmt", args...).Output()
	if err != nil {
		log.Debugf("Output : %s", string(output))
		log.Debugf("err : %s", err)
		return err
	}
	log.Debugf("Output : %s", string(output))
	return nil
}
