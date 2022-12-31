import React, {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {getCurrentConfig, getCurrentProject, setCurrentConfig} from "../../utils/localstorage-client";
import {useAppSelector} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {selectAuthData} from "../../features/auth/slice";
import {SwitchProject} from "../../features/projects/switch-project";
import {selectGetProjectData} from "../../features/projects/slice";

export const Home = () => {
    const authData = useAppSelector(selectAuthData);
    const getProjectData = useAppSelector(selectGetProjectData);

    const navigate = useNavigate();

    const [data, setData] = useState({
        isOpen: false,
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const currentProject: string = getCurrentProject();
    console.log("currentProject in home :", currentProject);
    if (!data.isOpen && (currentProject === null
        || currentProject === undefined
        || currentProject.length === 0)) {
        // choose from existing or create a new project
        setData({...data, isOpen: true})
    }

    const getDiagramData = () => {
        let diagramMakerData;
        const currentConfig = getCurrentConfig();

        const loadExisting = (currentConfig: string) => {
            if (!currentConfig) {
                return false;
            }
            if (currentConfig === "{}") {
                return false;
            }
            const currentConfigJson = JSON.parse(currentConfig);
            if (!currentConfigJson.panels) {
                return false;
            }
            if (currentConfigJson.panels === "{}") {
                return false;
            }
            return true;
        }

        if (loadExisting(currentConfig)) {
            diagramMakerData = JSON.parse(currentConfig);
        } else {
            // TODO below passed parameters aren't being used.
            diagramMakerData = getData(0, 0);
            setCurrentConfig(JSON.stringify(diagramMakerData));
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
