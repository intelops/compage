package languages

import (
	"context"
	"errors"
	log "github.com/sirupsen/logrus"
	"os"
	"os/exec"
	"strings"
)

// runs openapi-generator-cli with args passed.
func runOpenAPIGenerator(args ...string) error {
	path, err := exec.LookPath("openapi-generator-cli")
	if err != nil {
		log.Debugf("err : %s", err)
		return errors.New("'openapi-generator-cli' command doesn't exist")
	}
	log.Debugf("'openapi-generator-cli' is available at %s", path)
	err = os.Setenv("OPENAPI_GENERATOR_VERSION", "6.6.0")
	if err != nil {
		log.Debugf("err : %s", err)
		return err
	}
	output, err := exec.Command(path, args...).Output()
	if err != nil {
		log.Debugf("Output : %s", string(output))
		log.Debugf("err : %s", err)
		return err
	}
	log.Debugf("Output : %s", string(output))
	return nil
}

func writeFile(content string) (string, error) {
	file, err := os.CreateTemp("/tmp", "openapi")
	if err != nil {
		return "", err
	}

	defer func(f *os.File) {
		_ = f.Close()
	}(file)

	_, err0 := file.WriteString(content)

	return file.Name(), err0
}

func ProcessOpenAPITemplate(ctx context.Context) error {
	values := ctx.Value(ContextKeyLanguageContextVars).(Values)

	// create a file out of openAPIYamlContent in request.
	fileName, err := writeFile(values.LanguageNode.RestConfig.Server.OpenAPIFileYamlContent)
	if err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// dos2unix on the file
	if err = runDos2Unix(fileName); err != nil {
		log.Debugf("err : %s", err)
		return err
	}

	// generate code by openapi.yaml
	if err0 := runOpenAPIGenerator("generate", "-i", fileName, "-g", strings.ToLower(values.LanguageNode.RestConfig.Framework), "-o", values.NodeDirectoryName, "--git-user-id", values.TemplateVars[GitPlatformUserName], "--git-repo-id", values.TemplateVars[GitRepositoryName]+"/"+values.LanguageNode.Name); err0 != nil {
		log.Debugf("err : %s", err0)
		return errors.New("something happened while running openAPI generator")
	}

	// generate documentation for the code
	if err1 := runOpenAPIGenerator("generate", "-i", fileName, "-g", "dynamic-html", "-o", values.NodeDirectoryName+"/gen/docs", "--git-user-id", values.TemplateVars[GitPlatformUserName], "--git-repo-id", values.TemplateVars[GitRepositoryName]+"/"+values.LanguageNode.Name); err1 != nil {
		log.Debugf("err : %s", err1)
		return errors.New("something happened while running openAPI generator for documentation")
	}
	return nil
}

func runDos2Unix(fileName string) error {
	path, err := exec.LookPath("dos2unix")
	if err != nil {
		log.Debugf("err : %s", err)
		return errors.New("'dos2unix' command doesn't exist")
	}
	log.Debugf("dos2unix is available at %s", path)
	args := []string{fileName}
	output, err := exec.Command(path, args...).Output()
	log.Debugf("Output : %s", string(output))
	if err != nil {
		log.Debugf("err : %s", err)
		return err
	}
	return nil
}
