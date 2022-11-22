package internal

import (
	"github.com/kube-tarian/compage-core/internal/converter/rest"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/generator"
	log "github.com/sirupsen/logrus"
	"testing"
)

func TestAdd(t *testing.T) {
	jsonString := "{\n\t\"edges\": {\n\t\t\"edge1\": {\n\t\t\t\"id\": \"edge1\",\n\t\t\t\"src\": \"node1\",\n\t\t\t\"dest\": \"node2\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"clientTypes\": [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"port\": \"9999\",\n\t\t\t\t\t\t\"protocol\": \"REST\"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t}\n\t},\n\t\"nodes\": {\n\t\t\"node1\": {\n\t\t\t\"id\": \"node1\",\n\t\t\t\"typeId\": \"node-type-circle\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"name\": \"ServiceA\",\n\t\t\t\t\"template\": \"compage\",\n\t\t\t\t\"serverTypes\": [\n\t\t\t\t\t{\n\t\t\t\t\t\t\"protocol\": \"REST\",\n\t\t\t\t\t\t\"port\": \"9999\",\n\t\t\t\t\t\t\"framework\": \"net/http\",\n\t\t\t\t\t\t\"resources\": [\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\"Name\": \"User\",\n\t\t\t\t\t\t\t\t\"Fields\": {\n\t\t\t\t\t\t\t\t\t\"name\": \"string\",\n\t\t\t\t\t\t\t\t\t\"city\": \"string\",\n\t\t\t\t\t\t\t\t\t\"mobileNumber\": \"string\"\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t\"language\": \"Golang\",\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t},\n\t\t\"node2\": {\n\t\t\t\"id\": \"node2\",\n\t\t\t\"typeId\": \"node-type-rectangle\",\n\t\t\t\"consumerData\": {\n\t\t\t\t\"template\": \"compage\",\n\t\t\t\t\"name\": \"ServiceB\",\n\t\t\t\t\"language\": \"Golang\",\n\t\t\t\t\"metadata\": {},\n\t\t\t\t\"annotations\": {}\n\t\t\t}\n\t\t}\n\t}\n}"
	input := core.ProjectInput{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project",
		ProjectName:    "first-project",
		Yaml:           jsonString,
	}
	defer func() {
		//_ = os.RemoveAll("/tmp/first-project")
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
