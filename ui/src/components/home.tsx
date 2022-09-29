import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {getCurrentConfig} from "../utils/service";
import {Sample} from "./sample";

export const Home = () => {
    const {state} = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }
    let currentConfig = getCurrentConfig();
    let diagramMakerData
    if (currentConfig && currentConfig !== "{}") {
        diagramMakerData = JSON.parse(currentConfig);
    } else {
        diagramMakerData = getData(1050, 550);
    }
    return <Sample/>
    // return (
    //     <React.Fragment>
    //         <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
    //         <Button variant="contained" onClick={() => {
    //             removeCurrentConfig()
    //             removeCurrentState()
    //             removeModifiedState()
    //             setReset(true)
    //             // after resetting, needs to manually reload so, avoiding manual step here.
    //             window.location.reload();
    //         }}>Reset state</Button>
    //     </React.Fragment>
    // );
}
