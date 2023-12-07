package rust

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	rustValues := ctx.Value(contextKeyRustContextVars).(Values)

	// fills default config for rust
	if err := rustValues.RustNode.FillDefaults(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// generate rust project
	if err := Generate(ctx); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}
