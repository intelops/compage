import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";
import {CURRENT_CONFIG, CURRENT_STATE, getCurrentConfig} from "../service";
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
            <Button onClick={() => {
                localStorage.removeItem(CURRENT_CONFIG)
                localStorage.removeItem(CURRENT_STATE)
                localStorage.setItem("RESET", "true")
            }}>Reset state</Button>
        </Container>
    );
}
