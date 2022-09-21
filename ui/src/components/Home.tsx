import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";
import {
    getCurrentConfig,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../utils/service";
import Button from "@mui/material/Button";

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
        diagramMakerData = getData(600, 550);
    }
    return (
        <Container fixed>
            <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
            <Button variant="contained" onClick={() => {
                removeCurrentConfig()
                removeCurrentState()
                removeModifiedState()
                setReset(true)
                // after resetting, needs to manually reload so, avoiding manual step here.
                window.location.reload();
            }}>Reset state</Button>
        </Container>
    );
}
