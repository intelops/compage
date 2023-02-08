import React from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {getCurrentConfig, getCurrentProject, setCurrentConfig, setCurrentState} from "../../utils/localstorage-client";
import {useAppSelector} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {selectAuthData} from "../../features/auth/slice";
import {SwitchProject} from "../../features/projects/switch-project";
import {selectGetProjectData} from "../../features/projects/slice";

export const Home = () => {
    const authData = useAppSelector(selectAuthData);
    const getProjectData = useAppSelector(selectGetProjectData);

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const currentProject: string = getCurrentProject();
    console.log("currentProject in home :", currentProject);

    const loadExisting = (currentCnf: string) => {
        if (currentCnf === undefined || currentCnf === "undefined") {
            return false;
        }
        if (currentCnf === "{}") {
            return false;
        }
        const currentConfigJson = JSON.parse(currentCnf);
        if (!currentConfigJson.panels) {
            return false;
        }
        return currentConfigJson.panels !== "{}";
    };

    const getDiagramData = () => {
        let diagramMakerData;
        const currentConfig = getCurrentConfig();

        if (currentConfig && loadExisting(currentConfig)) {
            diagramMakerData = JSON.parse(currentConfig);
        } else {
            // TODO below passed parameters aren't being used.
            diagramMakerData = getData(0, 0, currentConfig);
            setCurrentConfig(diagramMakerData);
            setCurrentState(diagramMakerData);
        }
        return diagramMakerData;
    };

    const getContent = (): React.ReactNode => {
        if (
            currentProject === null
            || currentProject === undefined
            || currentProject.length === 0
        ) {
            // choose from existing or create a new project
            return <SwitchProject isOpen={true}></SwitchProject>;
        }
        return <SwitchProject isOpen={false}></SwitchProject>;
    };

    return <React.Fragment>
        {getContent()}
        <DiagramMakerContainer initialData={getDiagramData()} darkTheme={false}/>
    </React.Fragment>;
};
