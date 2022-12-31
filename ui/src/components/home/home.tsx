import React, {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {getCurrentProjectContext} from "../../utils/localstorage-client";
import {useAppSelector} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {selectAuthData} from "../../features/auth/slice";
import {CurrentProjectContext} from "../diagram-maker/models";
import {SwitchProject} from "../../features/projects/switch-project";

export const Home = () => {
    const authData = useAppSelector(selectAuthData);
    const navigate = useNavigate();

    const [data, setData] = useState({
        isOpen: false,
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const currentProjectContext: CurrentProjectContext = getCurrentProjectContext();
    console.log(currentProjectContext)
    if (!data.isOpen && (currentProjectContext === null
        || currentProjectContext === undefined
        || Object.keys(currentProjectContext).length === 0
        || currentProjectContext?.projectId.length === 0)) {
        // choose from existing or create a new project
        setData({...data, isOpen: true})
    }

    const getDiagramData = () => {
        const currentProjectContext: CurrentProjectContext = getCurrentProjectContext();
        let diagramMakerData
        if (currentProjectContext
            && Object.keys(currentProjectContext).length !== 0
            && currentProjectContext.state
            && currentProjectContext.state !== "{}"
        ) {
            diagramMakerData = currentProjectContext.state;
        } else {
            // TODO below passed parameters aren't being used.
            diagramMakerData = getData(0, 0);
        }
        return diagramMakerData;
    };

    const handleClose = async () => {
        setData({...data, isOpen: false})
        // TODO hack to reload after getProject is loaded
        await new Promise(r => setTimeout(r, 2000));
        navigate('/home');
    };

    return <React.Fragment>
        <SwitchProject isOpen={data.isOpen} handleClose={handleClose}></SwitchProject>
        <DiagramMakerContainer initialData={getDiagramData()} darkTheme={false}/>
    </React.Fragment>;
}
