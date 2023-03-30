package javascript

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	javascriptValues := ctx.Value(ContextVars).(Values)

	// fills default config for javascript
	if err := javascriptValues.JavaScriptNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate javascript project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
