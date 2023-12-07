/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
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
		if all {
			err := CloneOrPullRepository("go")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("python")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("java")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("javascript")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("ruby")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("rust")
			cobra.CheckErr(err)
			err = CloneOrPullRepository("typescript")
			cobra.CheckErr(err)
		} else {
			err := CloneOrPullRepository(languageTemplate)
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
