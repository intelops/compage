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
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		log.Errorf("Error getting user home directory: %s", err)
		return errors.New("'openapi-generator-cli' command doesn't exist")
	}
	binPath := userHomeDir + "/.openapi-generator/openapi-generator-cli.jar"
	_, err = os.Stat(binPath)
	if err != nil {
		log.Errorf("err : %s", err)
		return errors.New("'openapi-generator-cli.jar' file doesn't exist")
	}
	log.Debugf("openapi-generator-cli.jar is available at %s", binPath)
	args = append([]string{"-jar", binPath}, args...)
	output, err := exec.Command("java", args...).Output()
	if err != nil {
		log.Errorf("Output : %s", string(output))
		log.Errorf("err : %s", err)
		return err
	}
	if string(output) != "" {
		log.Debugf("Output : %s", string(output))
	}
	log.Infof("openapi-generator-cli ran successfully")
	return nil
}

func writeFile(content string) (string, error) {
	file, err := os.CreateTemp("/tmp", "openapi")
	if err != nil {
		log.Errorf("err : %s", err)
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
		log.Errorf("err : %s", err)
		return err
	}

	// dos2unix on the file
	if err = runDos2Unix(fileName); err != nil {
		log.Errorf("err : %s", err)
		return err
	}

	// generate code by openapi.yaml
	if err0 := runOpenAPIGenerator("generate", "-i", fileName, "-g", strings.ToLower(values.LanguageNode.RestConfig.Framework), "-o", values.NodeDirectoryName, "--git-user-id", values.TemplateVars[GitPlatformUserName], "--git-repo-id", values.TemplateVars[GitRepositoryName]+"/"+values.LanguageNode.Name); err0 != nil {
		log.Errorf("err : %s", err0)
		return errors.New("something happened while running openAPI generator")
	}

	// generate documentation for the code
	//if err1 := runOpenAPIGenerator("generate", "-i", fileName, "-g", "dynamic-html", "-o", values.NodeDirectoryName+"/gen/docs", "--git-user-id", values.TemplateVars[GitPlatformUserName], "--git-repo-id", values.TemplateVars[GitRepositoryName]+"/"+values.LanguageNode.Name); err1 != nil {
	//	log.Errorf("err : %s", err1)
	//	return errors.New("something happened while running openAPI generator for documentation")
	//}
	return nil
}

func runDos2Unix(fileName string) error {
	path, err := exec.LookPath("dos2unix")
	if err != nil {
		log.Errorf("err : %s", err)
		return errors.New("'dos2unix' command doesn't exist")
	}
	log.Debugf("dos2unix is available at %s", path)
	args := []string{fileName}
	output, err := exec.Command(path, args...).Output()
	if err != nil {
		log.Errorf("err : %s", err)
		return err
	}
	if string(output) != "" {
		log.Debugf("Output : %s", string(output))
	}
	return nil
}
