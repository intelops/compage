/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	ociregistry "github.com/intelops/compage/cmd/artifacts"
	"github.com/spf13/cobra"
)

var (
	languageTemplate string
	all              bool
)

// pullTemplatesCmd represents the pullTemplates command
var pullTemplatesCmd = &cobra.Command{
	Use:   "pullTemplates",
	Short: "Pulls the compage supported templates in the ~/.compage/templates directory",
	Long:  `Compage supports multiple templates for different languages. You can pull just the required template by lana or all the templates.`,
	Run: func(cmd *cobra.Command, args []string) {
		version := "latest"
		// common template is required for all the languages
		err := ociregistry.PullOCIArtifact("common", version)
		cobra.CheckErr(err)
		if all {
			err := ociregistry.PullOCIArtifact("go", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("python", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("java", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("javascript", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("ruby", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("rust", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("typescript", version)
			cobra.CheckErr(err)
			err = ociregistry.PullOCIArtifact("dotnet", version)
			cobra.CheckErr(err)
		} else {
			err := ociregistry.PullOCIArtifact(languageTemplate, version)
			cobra.CheckErr(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(pullTemplatesCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// pullTemplatesCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// pullTemplatesCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
	pullTemplatesCmd.Flags().BoolVar(&all, "all", false, "all templates")
	pullTemplatesCmd.Flags().StringVar(&languageTemplate, "language", "go", "language template")
}
