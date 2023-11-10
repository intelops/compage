package cmd

import (
	"fmt"
	"github.com/intelops/compage/cmd/prompts"

	"github.com/spf13/cobra"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initializes the compage configuration, generates the file and writes it down in the current directory",
	Long: `Compage configuration file is a yaml file that contains the configuration that guides the compage to generate the code. 

You can change the file as per your needs and then run the compage generate command to generate the code.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("init called")
		prompts.GetProjectDetails()
		prompts.GetGitPlatformDetails()
		createDefaultConfigFile()
	},
}

func createDefaultConfigFile() {
	// create default config file

}

func init() {
	rootCmd.AddCommand(initCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// initCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// initCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
