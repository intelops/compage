package main

import (
	"github.com/intelops/compage/cmd"
	log "github.com/sirupsen/logrus"
	"os"
)

func main() {
	cmd.Execute()
}

func init() {
	// log as JSON instead of the default ASCII formatter.
	// log.SetFormatter(&log.JSONFormatter{})
	log.SetFormatter(&log.TextFormatter{
		DisableColors: false,
		FullTimestamp: true,
	})
	// Output to stdout instead of the default stderr
	// Can be any io.Writer, see below for File example
	log.SetOutput(os.Stdout)
	// Only log the warning severity or above.
	log.SetLevel(log.DebugLevel)
}
