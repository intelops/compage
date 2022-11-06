import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import './create-project.css'
import {selectStatus} from "../store/compage-slice";
import {createProject} from "../service/compage-service";
import Button from "@mui/material/Button";
import {CreateProjectRequest} from "../models/redux-models";

const CreateProject = () => {
    const dispatch = useAppDispatch();
    const generatedProject = useAppSelector(state => state.compage.createdProject);
    const status = useAppSelector(selectStatus);
    const createProjectRequest: CreateProjectRequest = {
        userName: "mahendraintelops",
        email: "mahendra.b@intelops.dev",
        repositoryName: "first-project",
        projectName: "first-project",
        yaml: "{\n" +
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
            "        \"name\": \"node1\",\n" +
            "        \"isServer\": true,\n" +
            "        \"isClient\": false,\n" +
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
            "        \"type\": \"node2Type\",\n" +
            "        \"name\": \"node2\",\n" +
            "        \"isServer\": false,\n" +
            "        \"isClient\": true,\n" +
            "        \"language\": \"Golang\",\n" +
            "        \"url\": \"\"\n" +
            "      }\n" +
            "    }\n" +
            "  }\n" +
            "}\n"
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