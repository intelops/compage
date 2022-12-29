import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../diagram-maker/data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentProjectContext,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../../utils/localstorage-client";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";
import {selectAuthData} from "../../features/auth/slice";
import {ListProjectsRequest} from "../../features/projects/model";
import {listProjectsAsync} from "../../features/projects/async-apis/listProjects";
import {selectListProjectsStatus} from "../../features/projects/slice";

export const Home = () => {
    const authData = useAppSelector(selectAuthData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {}
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch])

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }
    if (getCurrentProjectContext() === null || getCurrentProjectContext() === undefined) {
        // choose from existing or create a new project
        // return <Navigate to="/repository"/>;
    } else {
        // open existing project
        // check for config if its present in the localstorage
        // if not pull state from github
    }

    const currentConfig = getCurrentConfig();
    let diagramMakerData
    if (currentConfig && currentConfig !== "{}") {
        diagramMakerData = JSON.parse(currentConfig);
    } else {
        // TODO below passed parameters aren't being used.
        diagramMakerData = getData(0, 0);
    }

    const resetState = () => {
        const message = "Are you sure you want to reset the project?";
        // TODO add project id here
        if (!window.confirm(message)) {
            return;
        }
        removeCurrentConfig()
        removeCurrentState()
        removeModifiedState()
        setReset(true)
        // TODO just reset to last saved state.
        // after resetting, needs to manually reload so, avoiding manual step here.
        window.location.reload();
    };

    return (
        <React.Fragment>
            <DiagramMakerContainer initialData={diagramMakerData} resetState={resetState} darkTheme={false}/>
        </React.Fragment>
    );
}
