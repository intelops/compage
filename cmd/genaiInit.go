package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/intelops/compage/cmd/models"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	openAIKey string
	userName  string
)

const llmBaseURL = "http://localhost:8000/api"

var genaiInit = &cobra.Command{
	Use:   "genaiInit",
	Short: "Checks if OPENAI_KEY is available in the environment, validates the tokens and userName is set in the command flags",
	Long:  "`Compage genaiInit` Command checks if OPENAI_KEY is available in the system environment, validates the API KEY and sends a request for our LLM server which handles its validation and authentication with our server.",
	Run: func(cmd *cobra.Command, args []string) {
		var err error
		// validate the OPENAI_KEY from the system environment
		// if not available, throw an error and exit
		// else, continue
		err = validateOpenAIKey()
		if err != nil {
			log.Errorf("Error validating OPENAI_KEY: %v", err)
			cobra.CheckErr(err)
		}

		// validate the userName from the userName flag
		// if not available, throw an error and exit
		// else, continue
		err = validateUserName(cmd)
		if err != nil {
			log.Errorf("Error validating userName: %v", err)
			cobra.CheckErr(err)
		}

		// validate the tokens
		// if not available, throw an error and exit
		// else, continue
		err = validateTokens()
		if err != nil {
			log.Errorf("Error in OPENAI KEY from the server: %v", err)
			cobra.CheckErr(err)
		}
	},
}

// validateOpenAIKey checks if the OPENAI_KEY environment variable is set.
// If not set, it returns an error. Otherwise, it continues without returning an error.
func validateOpenAIKey() error {
	// Check if OPENAI_KEY is set in the environment
	log.Infof("Checking if OPENAI_KEY is set in the environment...")

	var ok bool
	openAIKey, ok = os.LookupEnv("OPENAI_KEY")
	if !ok {
		message := fmt.Sprintf("%s is not set in the environment. Please set it and try again.", "OPENAI_KEY")
		return fmt.Errorf(message)
	}

	log.Info("OPENAI_KEY is successfully fetched from the system environment.")
	return nil
}

// validateUserName validates the userName from the userName flag.
// If the userName is not available, it throws an error and exits.
// Otherwise, it continues.
func validateUserName(cmd *cobra.Command) error {
	log.Infof("Checking if userName is set in the command flags...")
	userName, err := cmd.Flags().GetString("userName")
	if err != nil {
		return err
	}
	if userName == "" {
		message := fmt.Sprintf("%s is not set in the command flags. Please set it using a flag --userName and try again.", "userName")
		return fmt.Errorf(message)
	}
	log.Infof("userName is set to %s", userName)
	return nil
}

// validateTokens validates the openAI tokens from the backend llm server and sends a request to the server.
// If the tokens are not available, it throws an error and exits.
// Otherwise, it continues.
func validateTokens() error {
	log.Infof("Validating OPEN AI KEY from server...")
	if openAIKey == "" || userName == "" {
		message := fmt.Sprintf("%s or %s is not set. Please set them and try again.", "openAIKey", "userName")
		return fmt.Errorf(message)
	}

	// create a request body to send to the server
	requestBody, err := json.Marshal(map[string]string{
		"username": userName,
		"api_key":  openAIKey,
	})
	if err != nil {
		log.Infof("Error while marshaling request body: %v", err)
		return err
	}
	resp, err := http.Post(llmBaseURL+"/create-token", "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// read the response status code
	statusCode := resp.StatusCode
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if statusCode != http.StatusOK {
		return fmt.Errorf("%s", body)
	}

	// read the response body
	var accessToken models.LLMAccessToken
	err = json.Unmarshal(body, &accessToken)
	if err != nil {
		return err
	}
	v, err := AddGPTConfigForViper()
	if err != nil {
		return err
	}

	// write the OPENAI_ACCESS_TOKEN to the config file using viper
	v.Set("OPENAI_ACCESS_TOKEN", accessToken.AccessToken)
	err = v.WriteConfig()
	if err != nil {
		return err
	}

	// log the success message
	log.Infof("OpenAI Key is successfully validated.")
	return nil
}

func AddGPTConfigForViper() (*viper.Viper, error) {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	ok := isGPTConfigFilePresent(userHomeDir + "/.compage/gpt.env")
	if !ok {
		f, err := os.Create(userHomeDir + "/.compage/gpt.env")
		if err != nil {
			return nil, err
		}
		defer f.Close()
	}
	v := viper.New()
	v.AddConfigPath(userHomeDir + "/.compage")
	v.SetConfigName("gpt")
	v.SetConfigType("env")
	return v, nil
}

func isGPTConfigFilePresent(filepath string) bool {
	_, err := os.Stat(filepath)
	return err == nil
}

func init() {

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// genaiInit.PersistentFlags().StringVarP(&openAIKey, "openAIKey", "k", "", "OpenAI API Key")
	// genaiInit.PersistentFlags().StringVarP(&userName, "userName", "u", "", "User Name")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// genaiInit.Flags().BoolP("toggle", "t", false, "Help message for toggle")

	rootCmd.AddCommand(genaiInit)

	genaiInit.Flags().StringVar(&userName, "userName", "", "User Name")
}
