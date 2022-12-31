import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Grid} from "@mui/material";
import {GenerateCode} from "../../features/code-operations/component";
import {SwitchProject} from "../../features/projects/switch-project";
import Button from "@mui/material/Button";
import {
    getCurrentProject,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../../utils/localstorage-client";

const resetState = () => {
    const currentProject: string = getCurrentProject();
    const message = `Are you sure you want to reset the project [${currentProject}]?`;
    if (!window.confirm(message)) {
        return;
    }
    removeCurrentConfig();
    removeCurrentState();
    removeModifiedState();
    setReset(true);
    // TODO just reset to last saved state.
    // after resetting, needs to manually reload so, avoiding manual step here.
    window.location.reload();
};

export const ButtonsPanel = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        isOpen: false,
    });

    // When clicked, open the dialog
    const handleSwitchProjectClick = () => {
        setData({...data, isOpen: true})
    };

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

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
            <SwitchProject handleClose={handleClose} isOpen={data.isOpen}></SwitchProject>
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleSwitchProjectClick}>
                Switch Project
            </Button>
        </Grid>
        <hr/>
        <Grid item style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
        }}>
            <Button style={{
                width: "200px"
            }} variant="contained" color="error" onClick={resetState}>Reset state</Button>
        </Grid>
    </React.Fragment>;
}
