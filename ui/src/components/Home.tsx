import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Container from "@mui/material/Container";
import {Grid} from "@mui/material";

export const Home = () => {
    const {state, dispatch} = useContext(AuthContext);
    // const [diagramMakerState, setDiagramMakerState] = React.useState("{}");

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    const {avatar_url, name, public_repos, followers, following} = state.user

    let diagramMakerData = getData(500, 400);

    // const updateDiagramMakerState = (diagramMakerState: string) => {
    //     setDiagramMakerState(diagramMakerState)
    // }

    return (
        <Container fixed>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <DiagramMakerContainer initialData={diagramMakerData}
                                           /*updateDiagramMakerState={updateDiagramMakerState}*//>
                </Grid>
                <Grid item xs={4}>
                    {/*<ProfileCard/>*/}
                    {/*<JSONPretty id="jsonPretty" onJSONPrettyError={e => console.error(e)}*/}
                    {/*            data={diagramMakerState}></JSONPretty>*/}
                    {/*<Box>*/}
                    {/*    <div id="diagramMakerLogger"></div>*/}
                    {/*</Box>*/}
                </Grid>
            </Grid>
        </Container>
    );
}
