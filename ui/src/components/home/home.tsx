import React from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../../data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentRepositoryDetails,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../../utils/service";
import {useAppSelector} from "../../hooks/redux-hooks";
import {DiagramMakerContainer} from "../diagram-maker/diagram-maker-container";

export const Home = () => {
    const authentication = useAppSelector(state => state.authentication);
    if (!authentication.user.login) {
        return <Navigate to="/login"/>;
    }
    if (getCurrentRepositoryDetails() === null || getCurrentRepositoryDetails() === undefined) {
        // choose from existing or create a new project
        // return <Navigate to="/repository"/>;
    } else {
        // open existing project
        // check for config if its present in the localstorage
        // if not pull state from github
    }

    let currentConfig = getCurrentConfig();
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
