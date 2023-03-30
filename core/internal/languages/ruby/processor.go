package ruby

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	rubyValues := ctx.Value(ContextVars).(Values)

	// fills default config for ruby
	if err := rubyValues.RubyNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate ruby project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
