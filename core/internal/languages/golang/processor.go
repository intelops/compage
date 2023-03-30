package golang

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	goValues := ctx.Value(GoContextVars).(GoValues)

	// fills default config for golang
	if err := goValues.GoNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate golang project using custom template.
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// format the code generated
	if err := RunGoFmt(goValues.Values.NodeDirectoryName); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
