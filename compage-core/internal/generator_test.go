package internal

import (
	"github.com/kube-tarian/compage-core/internal/converter/rest"
	"github.com/kube-tarian/compage-core/internal/core"
	"github.com/kube-tarian/compage-core/internal/generator"
	log "github.com/sirupsen/logrus"
	"testing"
)

func TestAdd(t *testing.T) {
	input := core.ProjectInput{
		UserName:       "mahendraintelops",
		RepositoryName: "first-project",
		ProjectName:    "first-project",
		Yaml: "{\n" +
			"  \"edges\": {\n" +
			"    \"edge1\": {\n" +
			"      \"id\": \"edge1\",\n" +
			"      \"src\": \"node1\",\n" +
			"      \"dest\": \"node2\",\n" +
			"      \"diagramMakerData\": {\n" +
			"        \"selected\": true\n" +
			"      },\n" +
			"      \"consumerData\": {\n" +
			"        \"type\": \"sss_edge_edge\",\n" +
			"        \"name\": \"aaa\",\n" +
			"        \"protocol\": \"grpc\"\n" +
			"      }\n" +
			"    }\n" +
			"  },\n" +
			"  \"nodes\": {\n" +
			"    \"node1\": {\n" +
			"      \"id\": \"node1\",\n" +
			"      \"typeId\": \"node-type-circle\",\n" +
			"      \"diagramMakerData\": {\n" +
			"        \"selected\": false,\n" +
			"        \"dragging\": false\n" +
			"      },\n" +
			"      \"consumerData\": {\n" +
			"        \"type\": \"node1Type\",\n" +
			"        \"template\": \"compage\",\n" +
			"        \"name\": \"node1\",\n" +
			"        \"isServer\": true,\n" +
			"        \"language\": \"Golang\",\n" +
			"        \"url\": \"\"\n" +
			"      }\n" +
			"    },\n" +
			"    \"node2\": {\n" +
			"      \"id\": \"node2\",\n" +
			"      \"typeId\": \"node-type-rectangle\",\n" +
			"      \"diagramMakerData\": {\n" +
			"        \"selected\": false,\n" +
			"        \"dragging\": false\n" +
			"      },\n" +
			"      \"consumerData\": {\n" +
			"        \"template\": \"compage\",\n" +
			"        \"type\": \"node2Type\",\n" +
			"        \"name\": \"node2\",\n" +
			"        \"isServer\": false,\n" +
			"        \"language\": \"Golang\",\n" +
			"        \"url\": \"\"\n" +
			"      }\n" +
			"    }\n" +
			"  }\n" +
			"}\n",
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
