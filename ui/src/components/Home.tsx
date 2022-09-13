import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";

export const Home = () => {
    const {state} = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    let diagramMakerData = getData(600, 550);

    return (
        <Container fixed>
            <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
        </Container>
    );
}
