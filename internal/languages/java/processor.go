package java

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	javaValues := ctx.Value(contextKeyJavaContextVars).(Values)

	// fills default config for java
	if err := javaValues.JavaNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate java project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
