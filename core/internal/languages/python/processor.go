package python

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	pythonValues := ctx.Value(contextKeyPythonContextVars).(Values)

	// fills default config for python
	if err := pythonValues.PythonNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate python project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
