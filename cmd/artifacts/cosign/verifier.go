package cosign

import (
	"context"
	"fmt"
	log "github.com/sirupsen/logrus"
	"os/exec"
)

func VerifyImage(ctx context.Context) error {
	artifactURL := ctx.Value("artifactURL").(string)
	//publicKeyPath := ctx.Value("publicKeyPath").(string)
	publicKeyPath := "/Users/mahendrabagul/DevEnv/intelops/cosign-keys/cosign.pub"
	// Construct the command to verify the image
	cmd := exec.Command("cosign", "verify", "--key", publicKeyPath, artifactURL)

	// Capture the output and error if any
	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("verification failed: %w\nOutput: %s", err, output)
	}

	log.Infof("Verification succeeded:\n%s", output)
	return nil
}
