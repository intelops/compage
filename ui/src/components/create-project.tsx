import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import './create-project.css'
import {selectStatus} from "../store/compage-slice";
import {createProject} from "../service/compage-service";
import Button from "@mui/material/Button";
import {CompageYaml, CreateProjectRequest} from "../models/redux-models";

const CreateProject = () => {
    const dispatch = useAppDispatch();
    const generatedProject = useAppSelector(state => state.compage.createdProject);
    const status = useAppSelector(selectStatus);
    const compageYaml: CompageYaml = JSON.parse("{\n" +
        "\t\"edges\": {\n" +
        "\t\t\"edge1\": {\n" +
        "\t\t\t\"id\": \"edge1\",\n" +
        "\t\t\t\"src\": \"node1\",\n" +
        "\t\t\t\"dest\": \"node2\",\n" +
        "\t\t\t\"consumerData\": {\n" +
        "\t\t\t\t\"externalNodeName\": \"servicea\",\n" +
        "\t\t\t\t\"clientTypes\": [\n" +
        "\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\"port\": \"9999\",\n" +
        "\t\t\t\t\t\t\"protocol\": \"REST\"\n" +
        "\t\t\t\t\t}\n" +
        "\t\t\t\t],\n" +
        "\t\t\t\t\"metadata\": {},\n" +
        "\t\t\t\t\"annotations\": {}\n" +
        "\t\t\t}\n" +
        "\t\t}\n" +
        "\t},\n" +
        "\t\"nodes\": {\n" +
        "\t\t\"node1\": {\n" +
        "\t\t\t\"id\": \"node1\",\n" +
        "\t\t\t\"typeId\": \"node-type-circle\",\n" +
        "\t\t\t\"consumerData\": {\n" +
        "\t\t\t\t\"name\": \"ServiceA\",\n" +
        "\t\t\t\t\"template\": \"compage\",\n" +
        "\t\t\t\t\"serverTypes\": [\n" +
        "\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\"protocol\": \"REST\",\n" +
        "\t\t\t\t\t\t\"port\": \"9999\",\n" +
        "\t\t\t\t\t\t\"framework\": \"net/http\",\n" +
        "\t\t\t\t\t\t\"resources\": [\n" +
        "\t\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\t\"Name\": \"User\",\n" +
        "\t\t\t\t\t\t\t\t\"Fields\": {\n" +
        "\t\t\t\t\t\t\t\t\t\"id\": \"string\",\n" +
        "\t\t\t\t\t\t\t\t\t\"name\": \"string\",\n" +
        "\t\t\t\t\t\t\t\t\t\"city\": \"string\",\n" +
        "\t\t\t\t\t\t\t\t\t\"mobileNumber\": \"string\"\n" +
        "\t\t\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t\t\t},\n" +
        "\t\t\t\t\t\t\t{\n" +
        "\t\t\t\t\t\t\t\t\"Name\": \"Account\",\n" +
        "\t\t\t\t\t\t\t\t\"Fields\": {\n" +
        "\t\t\t\t\t\t\t\t\t\"id\": \"string\",\n" +
        "\t\t\t\t\t\t\t\t\t\"branch\": \"string\",\n" +
        "\t\t\t\t\t\t\t\t\t\"city\": \"string\"\n" +
        "\t\t\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t\t\t}\n" +
        "\t\t\t\t\t\t]\n" +
        "\t\t\t\t\t}\n" +
        "\t\t\t\t],\n" +
        "\t\t\t\t\"language\": \"Golang\",\n" +
        "\t\t\t\t\"metadata\": {},\n" +
        "\t\t\t\t\"annotations\": {}\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t\"node2\": {\n" +
        "\t\t\t\"id\": \"node2\",\n" +
        "\t\t\t\"typeId\": \"node-type-rectangle\",\n" +
        "\t\t\t\"consumerData\": {\n" +
        "\t\t\t\t\"template\": \"compage\",\n" +
        "\t\t\t\t\"name\": \"ServiceB\",\n" +
        "\t\t\t\t\"language\": \"Golang\",\n" +
        "\t\t\t\t\"metadata\": {},\n" +
        "\t\t\t\t\"annotations\": {}\n" +
        "\t\t\t}\n" +
        "\t\t}\n" +
        "\t}\n" +
        "}")
    compageYaml.version = "v1";

    const createProjectRequest: CreateProjectRequest = {
        userName: "mahendraintelops",
        email: "mahendra.b@intelops.dev",
        //TODO need to set the remaining fields here once available
        repository: {name: "first-project", branch: "main"},
        projectName: "first-project",
        yaml: compageYaml
    }
    // When clicked, dispatch `generateProject`:
    const handleClick = () => dispatch(createProject(createProjectRequest));
    return (
        <>
            <Button variant="contained" onClick={handleClick}>
                {status === "loading"
                    ? "Creating Project"
                    : "Create Project"}
            </Button>
            <div>
                {JSON.stringify(generatedProject)}
                {/*{generatedProject.name} and {generatedProject.fileChunk}*/}
            </div>
        </>
    );
}
export default CreateProject;