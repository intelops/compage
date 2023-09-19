import React, {useEffect} from "react";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentProjectDetails,
    setCurrentConfig,
    setCurrentState
} from "../../utils/localstorageClient";
import {useAppDispatch} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {SwitchProject} from "../../features/projects-operations/switch-project";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {GetProjectRequest} from "../../features/projects-operations/model";
import {existsProjectAsync} from "../../features/projects-operations/async-apis/existsProject";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import {Login} from "../auth/login";

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

    useEffect(() => {
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
    }, [dispatch]);

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

    const isUserNotLoggedIn = () => {
        const currentUser: string = getCurrentUser();
        return (currentUser === null || currentUser === undefined
            || currentUser.length === 0);
    };

    const isProjectNotValid = () => {
        const currentProjectDetails: string = getCurrentProjectDetails();
        return (currentProjectDetails === null || currentProjectDetails === undefined
            || currentProjectDetails.length === 0);
    };

    const handleLoginClose = () => {
        // TODO hack to reload after getProject is loaded
        window.location.reload();
    };

    const getContent = (): React.ReactNode => {
        if (isUserNotLoggedIn()) {
            // TODO redirect to login page
            return <Login isOpen={true} handleClose={handleLoginClose}></Login>;
        }
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
