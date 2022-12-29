import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Grid} from "@mui/material";
import {GenerateCode} from "../../features/code-operations/component";
import {SwitchProject} from "../../features/projects/switch-project";
import Button from "@mui/material/Button";

export const Panel = () => {
    const navigate = useNavigate()

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
    </React.Fragment>;
}
