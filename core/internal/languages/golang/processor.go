package golang

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	golangValues := ctx.Value(GoContextVars).(GoValues)

	// fills default config for golang
	if err := golangValues.LGoLangNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate golang project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// format the code generated
	if err := RunGoFmt(golangValues.Values.NodeDirectoryName); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
