import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";

export const Home = () => {
    const {state, dispatch} = useContext(AuthContext);
    // const [diagramMakerState, setDiagramMakerState] = React.useState("{}");

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    const {avatar_url, name, public_repos, followers, following} = state.user

    let diagramMakerData = getData(600, 550);

    // const updateDiagramMakerState = (diagramMakerState: string) => {
    //     setDiagramMakerState(diagramMakerState)
    // }

    return (
        <Container fixed>
            <DiagramMakerContainer initialData={diagramMakerData}/>
        </Container>
    );
}
