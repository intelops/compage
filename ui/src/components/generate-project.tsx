import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {generateProjectAction} from '../store/compage-actions';
import './generate-project.css'
import {selectStatus} from "../store/compage-slice";

const GenerateProject = () => {
    const dispatch = useAppDispatch();
    const generatedProject = useAppSelector(state => state.compage.generatedProject);
    const status = useAppSelector(selectStatus);

    // When clicked, dispatch `generateProject`:
    const handleClick = () => dispatch(generateProjectAction(10));

    return (
        <>
            <div>
                <button type="button" onClick={handleClick}>
                    {status === "loading"
                        ? "Generating Project"
                        : "Generate Project"}
                </button>
            </div>
            <div>
                {generatedProject.name} and {generatedProject.fileChunk}
            </div>
        </>
    );
}
export default GenerateProject;