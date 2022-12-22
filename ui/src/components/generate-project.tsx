import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import './generate-project.css'
import {selectStatus} from "../store/compage-slice";
import {generateProject} from "../service/compage-service";
import Button from "@mui/material/Button";
import {GenerateProjectRequest} from "../models/redux-models";

const GenerateProject = () => {
    const dispatch = useAppDispatch();
    const generatedProject = useAppSelector(state => state.compage.generatedProject);
    const status = useAppSelector(selectStatus);

    const generateProjectRequest: GenerateProjectRequest = {
        projectId: "mahen-first-31346",
    }

    // When clicked, dispatch `generateProject`:
    const handleClick = () => dispatch(generateProject(generateProjectRequest));
    return (
        <>
            <Button variant="contained" onClick={handleClick}>
                {status === "loading"
                    ? "Generating Project"
                    : "Generate Project"}
            </Button>
            <div>
                {/*{JSON.stringify(generatedProject)}*/}
                {/*{generatedProject.name} and {generatedProject.fileChunk}*/}
            </div>
        </>
    );
}
export default GenerateProject;