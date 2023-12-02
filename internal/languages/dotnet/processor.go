package dotnet

import (
	"context"
	log "github.com/sirupsen/logrus"
)

func Process(ctx context.Context) error {
	dotNetValues := ctx.Value(contextKeyDotNetContextVars).(DotNetValues)

	// fills default config for DotNet
	if err := dotNetValues.LDotNetLangNode.FillDefaults(); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate DotNet project
	if err := Generate(ctx); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	return nil
}
