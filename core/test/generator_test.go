package test

import (
	"github.com/intelops/compage/core/internal/converter/rest"
	"github.com/intelops/compage/core/internal/core"
	"github.com/intelops/compage/core/internal/generator"
	log "github.com/sirupsen/logrus"
	"os"
	"testing"
)

func TestGenerator(t *testing.T) {
	jsonString := "{\n\t\"edges\": {\n\t\t\"edge1\": {\n\t\t\t\"id\": \"edge1\",\n\t\t\t\"src\": \"node1\",\n\t\t\t\"dest\": \"node2\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"externalNode\": \"servicea\",\n\t\t\t\t\"clientTypes\": [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"port\": \"9999\",\n\t\t\t\t\t\t\"protocol\": \"REST\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t}\n\t},\n\t\"nodes\": {\n\t\t\"node1\": {\n\t\t\t\"id\": \"node1\",\n\t\t\t\"typeId\": \"node-type-circle\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"name\": \"ServiceA\",\n\t\t\t\t\"template\": \"compage\",\n\t\t\t\t\"serverTypes\": [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"protocol\": \"REST\",\n\t\t\t\t\t\t\"port\": \"9999\",\n\t\t\t\t\t\t\"framework\": \"go-gin\",\n\t\t\t\t\t\t\"resources\": [\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"Name\": \"User\",\n\t\t\t\t\t\t\t\t\"Fields\": {\n\t\t\t\t\t\t\t\t\t\"id\": \"string\",\n\t\t\t\t\t\t\t\t\t\"name\": \"string\",\n\t\t\t\t\t\t\t\t\t\"city\": \"string\",\n\t\t\t\t\t\t\t\t\t\"mobileNumber\": \"string\"\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"Name\": \"Account\",\n\t\t\t\t\t\t\t\t\"Fields\": {\n\t\t\t\t\t\t\t\t\t\"id\": \"string\",\n\t\t\t\t\t\t\t\t\t\"branch\": \"string\",\n\t\t\t\t\t\t\t\t\t\"city\": \"string\"\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"language\": \"go\",\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t},\n\t\t\"node2\": {\n\t\t\t\"id\": \"node2\",\n\t\t\t\"typeId\": \"node-type-rectangle\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"template\": \"compage\",\n\t\t\t\t\"name\": \"ServiceB\",\n\t\t\t\t\"language\": \"go\",\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t}\n\t}\n}"
	input := core.ProjectInput{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project-github",
		ProjectName:    "first-project",
		Json:           jsonString,
	}
	defer func() {
		_ = os.RemoveAll("/tmp/first-project")
	}()

	// retrieve project struct
	project, err := rest.GetProject(input)
	if err != nil {
		log.Error(err)
		return
	}
	// trigger project generation
	if err = generator.Generator(project); err != nil {
		log.Error(err)
	}
}
