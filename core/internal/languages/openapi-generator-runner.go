package languages

import (
	log "github.com/sirupsen/logrus"
	"os/exec"
)

// RunOpenApiGenerator runs openapi-generator-cli with args passed.
func RunOpenApiGenerator(args ...string) error {
	output, err := exec.Command("openapi-generator-cli", args...).Output()
	if err != nil {
		log.Debugf("Output : %s", string(output))
		log.Debugf("err : %s", err)
		return err
	}
	log.Debugf("Output : %s", string(output))
	return nil
}
