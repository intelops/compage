import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Grid} from "@mui/material";
import {GenerateCode} from "../../features/code-operations/component";
import {SwitchProject} from "../../features/projects-operations/switch-project";
import Button from "@mui/material/Button";

export const ButtonsPanel = () => {
    const navigate = useNavigate();

    const [payload, setPayload] = useState({
        isOpen: false,
    });

    // When clicked, open the dialog
    const handleSwitchProjectClick = () => {
        setPayload({...payload, isOpen: true});
        navigate('/home');
    };

    const handleClose = () => {
        setPayload({...payload, isOpen: false});
        navigate('/home');
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
            <SwitchProject handleClose={handleClose} isOpen={payload.isOpen}></SwitchProject>
            <Button style={{
                width: "200px"
            }} variant="contained" disabled={payload.isOpen} onClick={handleSwitchProjectClick}>
                Switch Project
            </Button>
        </Grid>
    </React.Fragment>;
};
