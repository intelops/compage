package prompts

import (
	"errors"
	"github.com/manifoldco/promptui"
	"net/url"
	"regexp"
)

const StringPattern = "^[a-zA-Z_][a-zA-Z0-9_-]*$"

func validateStringInput(input string) error {
	// check if input is valid string or not
	regexpPattern := regexp.MustCompile(StringPattern)
	if !regexpPattern.MatchString(input) {
		return errors.New("invalid input")
	}
	return nil
}

func validateURLStringInput(input string) error {
	_, err := url.ParseRequestURI(input)
	if err != nil {
		return errors.New("invalid input")
	}
	return nil
}

func GetInputString(label, defaultValue string) (string, error) {
	prompt := promptui.Prompt{
		Label:    label,
		Default:  defaultValue,
		Validate: validateStringInput,
	}

	return prompt.Run()
}

func GetInputURLString(label, defaultValue string) (string, error) {
	prompt := promptui.Prompt{
		Label:    label,
		Default:  defaultValue,
		Validate: validateURLStringInput,
	}

	return prompt.Run()
}

func GetInputBoolean(label string, defaultValue bool) (string, error) {
	prompt := promptui.Prompt{
		Label:     label,
		IsConfirm: defaultValue,
	}
	return prompt.Run()
}
