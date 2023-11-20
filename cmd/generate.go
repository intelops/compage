package cmd

import (
	"github.com/intelops/compage/cmd/models"
	"github.com/intelops/compage/internal/converter/cmd"
	"github.com/intelops/compage/internal/handlers"
	"github.com/intelops/compage/internal/utils"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

// generateCmd represents the generate command
var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "Generates the code for the given configuration",
	Long: `This will generate the code for the given configuration. The configuration file is a yaml file that contains the configuration that guides the compage to generate the code.

Change the file as per your needs and then run the compage generate command to generate the code.`,
	Run: func(cmd *cobra.Command, args []string) {
		GenerateCode()
	},
}

func init() {
	rootCmd.AddCommand(generateCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// generateCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// generateCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

func GenerateCode() {
	// Read the file from the current directory and convert it to project
	project, err := models.ReadConfigYAMLFile("config.yaml")
	cobra.CheckErr(err)

	// converts to core project
	coreProject, err := cmd.GetProject(project)
	if err != nil {
		log.Errorf("error while converting request to project [" + err.Error() + "]")
		return
	}

	// triggers project generation, process the request
	err0 := handlers.Handle(coreProject)
	if err0 != nil {
		log.Errorf("error while generating the project [" + err0.Error() + "]")
		return
	}
	log.Infof("project generated successfully at %s", utils.GetProjectDirectoryName(project.Name))
}
