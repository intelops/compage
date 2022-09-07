import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {ProfileCard} from "./profile";

export const Home = () => {
    const {state, dispatch} = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    const {avatar_url, name, public_repos, followers, following} = state.user

    let diagramMakerData = getData(500, 400);
    return (
        <Container fixed>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <DiagramMakerContainer initialData={diagramMakerData}/>
                </Grid>
                <Grid item xs={4}>
                    <ProfileCard/>
                    <Box>
                        <div id="diagramMakerLogger"></div>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
