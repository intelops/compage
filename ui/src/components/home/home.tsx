import React, {useEffect} from "react";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentProjectDetails, isProjectNotValid,
    setCurrentConfig,
    setCurrentState
} from "../../utils/localstorageClient";
import {useAppDispatch} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {getCurrentUser, isUserNotLoggedIn} from "../../utils/sessionstorageClient";
import {GetProjectRequest} from "../../features/projects-operations/model";
import {existsProjectAsync} from "../../features/projects-operations/async-apis/existsProject";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import {useNavigate} from "react-router-dom";

const isSameUser = () => {
    const currentProjectDetails = getCurrentProjectDetails();
    if (currentProjectDetails) {
        const currentUserAndProjectAndVersion = currentProjectDetails.split("###");
        return getCurrentUser() === currentUserAndProjectAndVersion[0];
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
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (isUserNotLoggedIn()) {
            navigate('/login');
        }
        if (isProjectNotValid()) {
            navigate('/switch-project');
        }
        const currentProjectDetails: string = getCurrentProjectDetails();
        if (currentProjectDetails) {
            const userNameAndProjectAndVersion = currentProjectDetails.split("###");
            const getProjectRequest: GetProjectRequest = {
                id: userNameAndProjectAndVersion[1],
                email: getCurrentUser()
            };
            dispatch(existsProjectAsync(getProjectRequest));
            const getCurrentProjectContext: GetCurrentContextRequest = {
                email: getCurrentUser()
            };
            dispatch(getCurrentContextAsync(getCurrentProjectContext));
        }
    }, [dispatch, navigate]);

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

    return <React.Fragment>
        <DiagramMakerContainer initialData={getDiagramData()} darkTheme={false}/>
    </React.Fragment>;
};
