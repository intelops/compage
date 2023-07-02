import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentProjectDetails,
    setCurrentConfig,
    setCurrentState
} from "../../utils/localstorage-client";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {selectAuthData} from "../../features/auth-operations/slice";
import {SwitchProject} from "../../features/projects-operations/switch-project";
import {getCurrentUserName} from "../../utils/sessionstorage-client";
import {GetProjectRequest} from "../../features/projects-operations/model";
import {existsProjectAsync} from "../../features/projects-operations/async-apis/existsProject";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";

const isSameUser = () => {
    const currentProjectDetails = getCurrentProjectDetails();
    if (currentProjectDetails) {
        const userNameAndProjectAndVersion = currentProjectDetails.split("###");
        return getCurrentUserName() === userNameAndProjectAndVersion[0];
    }
    return false;
};

const loadExisting = (currentCnf: string) => {
    if (currentCnf === undefined || currentCnf === "undefined" || currentCnf === "{}") {
        return false;
    }
    const currentConfigJson = JSON.parse(currentCnf);
    if (!currentConfigJson.panels) {
        return false;
    }
    return currentConfigJson.panels !== "{}" && isSameUser();
};

export const Home = () => {
    const authData = useAppSelector(selectAuthData);
    // const existsProjectError = useAppSelector(selectExistsProjectError);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (authData.login) {
            const currentProjectDetails: string = getCurrentProjectDetails();
            if (currentProjectDetails) {
                const userNameAndProjectAndVersion = currentProjectDetails.split("###");
                const getProjectRequest: GetProjectRequest = {
                    id: userNameAndProjectAndVersion[1]
                };
                dispatch(existsProjectAsync(getProjectRequest));
                const getCurrentProjectContext: GetCurrentContextRequest = {};
                dispatch(getCurrentContextAsync(getCurrentProjectContext));
            }
        }
    }, [dispatch]);

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    // const message = JSON.parse(existsProjectError)?.message;

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

    const isProjectNotValid = () => {
        const currentProjectDetails: string = getCurrentProjectDetails();
        return (currentProjectDetails === null || currentProjectDetails === undefined
            || currentProjectDetails.length === 0);
    };

    const getContent = (): React.ReactNode => {
        // below check is commented as the recent existsProject calls response is checked. Need to find a way to get the correct content here.
        if (isProjectNotValid() /*|| message?.includes("404")*/) {
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
