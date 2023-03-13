import * as React from 'react';
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";

export const Footer = () => {
    return (
            <AppBar style={{
                backgroundColor: "lightgray",
                top: "auto",
                bottom: 0,
                textAlign: "center"
            }}>
                <Toolbar style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <Typography variant="h6" >
                        A great help to developer by IntelOps!!!
                    </Typography>
                </Toolbar>
            </AppBar>
    );
};