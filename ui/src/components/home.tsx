import React from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentRepositoryDetails,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../utils/service";
import {useAppSelector} from "../hooks/redux-hooks";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Button from "@mui/material/Button";
import CreateProject from "./create-project";

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
        diagramMakerData = getData(1050, 550);
    }

    return (
        <React.Fragment>
            <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
            <Button variant="contained" onClick={() => {
                removeCurrentConfig()
                removeCurrentState()
                removeModifiedState()
                setReset(true)
                // after resetting, needs to manually reload so, avoiding manual step here.
                window.location.reload();
            }}>Reset state</Button>
            <CreateProject></CreateProject>
        </React.Fragment>
    );
}
