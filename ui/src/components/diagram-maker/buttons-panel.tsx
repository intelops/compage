import {useNavigate} from "react-router-dom";
import React from "react";
import {Grid} from "@mui/material";
import {GenerateCode} from "../../features/code-operations/component";
import Button from "@mui/material/Button";

export const ButtonsPanel = () => {
    const navigate = useNavigate();

    // When clicked, open the dialog
    const handleSwitchProjectClick = () => {
        navigate('/switch-project');
    };

    return <React.Fragment>
        <Grid item style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
        }}>
            <GenerateCode></GenerateCode>
        </Grid>
        <hr/>
        <Grid item style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
        }}>
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleSwitchProjectClick}>
                Switch Project
            </Button>
        </Grid>
    </React.Fragment>;
};
