import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {getCurrentConfig, getCurrentRepoDetails} from "../utils/service";
import Todo from "./Todo";

export const Home = () => {
    const {state} = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }
    if (getCurrentRepoDetails() === null || getCurrentRepoDetails() === undefined) {
        // choose from existing or create a new project
        return <Navigate to="/repo"/>;
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
    return <Todo></Todo>
    //    return (
    //        <React.Fragment>
    //            <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
    //            <Button variant="contained" onClick={() => {
    //                removeCurrentConfig()
    //                removeCurrentState()
    //                removeModifiedState()
    //                setReset(true)
    // // after resetting, needs to manually reload so, avoiding manual step here.
    //                window.location.reload();
    //            }}>Reset state</Button>
    //        </React.Fragment>
    //    );
}
