package typescript

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	typescriptValues := ctx.Value(contextKeyTypeScriptContextVars).(Values)

	// fills default config for typescript
	if err := typescriptValues.TypeScriptNode.FillDefaults(); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// generate typescript project
	if err := Generate(ctx); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	return nil
}
