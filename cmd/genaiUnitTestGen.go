package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/intelops/compage/cmd/models"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var (
	accessToken        string
	prompt             string
	client             *http.Client
	codeLanguage       string
	compageProjectName string
)

var gptUnitTestCmd = &cobra.Command{
	Use:   "genaiUnitTestGen",
	Short: "Generate test files for the project",
	Long:  "Generate test files for the provided configured compage project in the current directory.",
	Run: func(cmd *cobra.Command, args []string) {
		var err error
		compageProjectName, err = cmd.Flags().GetString("compageProjectName")
		if err != nil {
			cobra.CheckErr(err)
		}

		codeLanguage, err = cmd.Flags().GetString("codeLanguage")
		if err != nil {
			cobra.CheckErr(err)
		}
		// Validate flags
		err = validateFlags()
		if err != nil {
			cobra.CheckErr(err)
		}

		// Fetch unit tests from server
		err = FetchUnitTestFromServer()
		if err != nil {
			cobra.CheckErr(err)
		}

	},
}

func validateFlags() error {
	if codeLanguage == "" && compageProjectName == "" {
		message := fmt.Sprintf("%s and %s are not set. Please use `compage genaiUnitTestGen --compageProjectName <projectName> --codeLanguage <language>` command before running this command", "Project Name", "Language")
		return fmt.Errorf(message)
	}

	if compageProjectName == "" {
		message := fmt.Sprintf("%s is not set. Please use `compage genaiUnitTestGen --compageProjectName <projectName> --codeLanguage <language>` command before running this command", "Project Name")
		return fmt.Errorf(message)
	}

	_, err := os.Stat(compageProjectName)

	if compageProjectName != "" && err != nil {
		message := fmt.Sprintf("%s is not available. Please generate the project using `compage generate` command. To know more about compage, visit https://github.com/intelops/compage", compageProjectName)
		return fmt.Errorf(message)
	}

	if codeLanguage == "" {
		message := fmt.Sprintf("%s is not set. Please use `compage genaiUnitTestGen --compageProjectName <projectName> --codeLanguage <language>` command before running this command", "Language")
		return fmt.Errorf(message)
	}

	return nil
}

func FetchUnitTestFromServer() error {
	var excludedExtensionsUnitTests = []string{".toml", ".md", "LICENSE", "Dockerfile", "Tests", ".yaml", "yml", "Properties", ".json", ".csproj", "Application", "Infrastructure", "Core", ".sln", "Program.cs"}
	var excludedExtensionsDocs = []string{".toml", ".md", "LICENSE", ".github", ".json", "Properties", ".csproj", ".sln" }

	result, err := collectFolderAndFileData(compageProjectName, true, excludedExtensionsUnitTests)
	if err != nil {
		return err
	}

	// create a new http client
	client = &http.Client{}

	for key := range result {
		// make a request to the server;kk
		log.Infof("Generating unit tests for %s", key)
		err = makeUnitTestServerCall(result[key], codeLanguage)
		if err != nil {
			return err
		}
	}

	// fetch all files from the compage project
	entireFolderStructure, err := collectFolderData(compageProjectName, true, excludedExtensionsDocs)
	if err != nil {
		return err
	}

	// flow of structure
	flow := strings.Join(entireFolderStructure, " --> ")
	err = makeDocumentationServerCall(flow, codeLanguage)
	if err != nil {
		return err
	}

	return nil
}

func makeUnitTestServerCall(code string, language string) error {
	if code == "" {
		return fmt.Errorf("code is empty")
	}

	if language == "" {
		return fmt.Errorf("language is empty")
	}

	if accessToken == "" {
		message := fmt.Sprintf("%s is not set. Please run `compage gpt` command before running this command", "Access Token")
		return fmt.Errorf(message)
	}

	prompt = fmt.Sprintf("Generate unit tests for the following code: \n\n %s \n\n", code)

	if strings.ToLower(language) == "dotnet" {
		prompt = fmt.Sprintf("Generate unit tests and Code Explanation document for the following code: \n\n %s \n\nusing MS Test Framework for testing with proper context and provide the steps to execute the unit test case code", code)
	}

	// create the request body
	requestBody, err := json.Marshal(map[string]string{
		"prompt":   prompt,
		"language": language,
	})

	if err != nil {
		return err
	}

	// create a request
	req, err := http.NewRequest("POST", llmBaseURL+"/code_generate", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}

	// set headers with the access token
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		// read the status code for the response
		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("error generating unit test: %v", err)
		}
		return err
	}

	var codeGenResponse models.CodeGenResponse
	err = json.Unmarshal(body, &codeGenResponse)
	if err != nil {
		return err
	}

	log.Infof("Response from server: %s", codeGenResponse.Data)

	return nil
}

func makeDocumentationServerCall(code string, language string) error {
	if code == "" {
		return fmt.Errorf("code is empty")
	}

	if language == "" {
		return fmt.Errorf("language is empty")
	}

	if accessToken == "" {
		message := fmt.Sprintf("%s is not set. Please run `compage gpt` command before running this command", "Access Token")
		return fmt.Errorf(message)
	}

	prompt = fmt.Sprintf("Generate documentation for the following project structure which is provided below in the %s programming language and also generate code flow diagram using mermaid	language. The entire documentation should be in markdown format with proper context . \n %s ", language, code)

	// create the request body
	requestBody, err := json.Marshal(map[string]string{
		"prompt":   prompt,
		"language": language,
	})
	if err != nil {
		return err
	}

	// create a request
	req, err := http.NewRequest("POST", llmBaseURL+"/doc_generate", bytes.NewBuffer(requestBody))
	if err != nil {
		return err
	}
	// set headers with the access token
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	// send the request
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		// read the status code for the response
		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("error generating documentation: %v", err)
		}
		return err
	}
	var docGenResponse models.DocGenResponse
	err = json.Unmarshal(body, &docGenResponse)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("error generating documentation due to : %s", "tokens")
	}

	if docGenResponse.Data.Docs == "" {
		return fmt.Errorf("no documentation generated")
	}
	// write the documentation to a file
	filePath := filepath.Join(compageProjectName, "Documentation.md")
	err = os.WriteFile(filePath, []byte(docGenResponse.Data.Docs), 0644)
	if err != nil {
		return err
	}

	log.Infof("Response from server: %s", docGenResponse.Data)

	return nil
}

// File reader code starts here
func shouldIncludeFile(filePath string, excludedExtensions []string) bool {
	for _, ext := range excludedExtensions {
		if strings.Contains(filePath, ext) {
			return false
		}
	}
	return true
}

func readFile(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("Error reading %s: %v\n", filePath, err)
		return "", err
	}
	return string(content), nil
}

func collectFolderAndFileData(rootFolder string, shouldExcluded bool, excludedDirs []string) (map[string]string, error) {
	result := make(map[string]string)

	err := filepath.Walk(rootFolder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("Error walking path %s: %v\n", path, err)
			return err
		}

		if info.IsDir() {
			return nil // Skip directories
		}

		if shouldExcluded {
			// check if the file should be included
			shouldFileIncluded := shouldIncludeFile(path, excludedDirs)
			if shouldFileIncluded {
				content, err := readFile(path)
				if err == nil {
					result[path] = content
				}
			}
		} else {
			content, err := readFile(path)
			if err == nil {
				result[path] = content
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return result, nil
}

func collectFolderData(rootFolder string, shouldExcluded bool, excludedDirs []string) ([]string, error) {
	result := make([]string, 0)

	err := filepath.Walk(rootFolder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Printf("Error walking path %s: %v\n", path, err)
			return err
		}

		if info.IsDir() {
			return nil // Skip directories
		}

		if shouldExcluded {
			// check if the file should be included
			shouldFileIncluded := shouldIncludeFile(path, excludedDirs)
			if shouldFileIncluded {
				result = append(result, path)
			}
		} else {
			result = append(result, path)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return result, nil

}

// File reader code ends here

func init() {
	// add viper configuration
	v, err := AddGPTConfigForViper()
	if err != nil {
		log.Error(err)
	}
	err = v.ReadInConfig()
	if err != nil {
		log.Error(err)
	}
	accessToken = v.GetString("OPENAI_ACCESS_TOKEN")

	rootCmd.AddCommand(gptUnitTestCmd)
	gptUnitTestCmd.Flags().StringVar(&codeLanguage, "codeLanguage", "", "Language (go, dotnet)")
	gptUnitTestCmd.Flags().StringVar(&compageProjectName, "compageProjectName", "", "Project name")
}
