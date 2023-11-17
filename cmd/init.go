package cmd

import (
	"github.com/intelops/compage/cmd/prompts"
	"github.com/intelops/compage/internal/languages/executor"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"os"
)

// initCmd represents the init command
var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initializes the compage configuration, generates the file and writes it down in the current directory",
	Long: `Compage configuration file is a yaml file that contains the configuration that guides the compage to generate the code. 

You can change the file as per your needs and then run the compage generate command to generate the code.`,
	Run: func(cmd *cobra.Command, args []string) {
		projectDetails, err := prompts.GetProjectDetails()
		cobra.CheckErr(err)
		gitPlatformDetails, err := prompts.GetGitPlatformDetails()
		cobra.CheckErr(err)
		createOrUpdateDefaultConfigFile(projectDetails, gitPlatformDetails)
	},
}

func createOrUpdateDefaultConfigFile(pd *prompts.ProjectDetails, gpd *prompts.GitPlatformDetails) {
	// create default config file
	configFilePath := "config.yaml"
	_, err := os.Stat(configFilePath)
	if os.IsExist(err) {
		log.Warnf("config file already exists at %s", configFilePath)
		overwriteConfirmation, err := prompts.GetInputBoolean("Do you want to overwrite the existing config file? (y/n)", false)
		cobra.CheckErr(err)
		if overwriteConfirmation == "n" {
			log.Infof("skipping config file creation")
			return
		}
	}

	err = os.Remove(configFilePath)
	if err != nil && !os.IsNotExist(err) {
		log.Warnf("error while removing the config file %s", err)
		cobra.CheckErr(err)
	}
	_, err = os.Create(configFilePath)
	cobra.CheckErr(err)
	contentData, err := Content.ReadFile("config.yaml.tmpl")
	cobra.CheckErr(err)
	// copy the default config file and use go template to replace the values
	err = os.WriteFile(configFilePath, contentData, 0644)
	cobra.CheckErr(err)

	var filePaths []*string
	filePaths = append(filePaths, &configFilePath)
	data := make(map[string]interface{})
	data["ProjectName"] = pd.ProjectName
	data["GitRepositoryName"] = gpd.RepositoryName
	data["GitRepositoryURL"] = gpd.PlatformURL + "/" + gpd.PlatformUserName + "/" + gpd.RepositoryName
	data["GitPlatformName"] = gpd.PlatformName
	data["GitPlatformURL"] = gpd.PlatformURL
	data["GitPlatformUserName"] = gpd.PlatformUserName

	err = executor.Execute(filePaths, data)
	cobra.CheckErr(err)
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
