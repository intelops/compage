import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {config} from "../../utils/constants";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import {Button} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import Logo from "../../logo.png";
import {LoginRequest} from "./model";
import {loginAsync} from "./async-apis/login";
import {selectAuthData} from "./slice";

export const Login = () => {
    const dispatch = useAppDispatch();
    const authData = useAppSelector(selectAuthData);
    const {client_id, redirect_uri} = config;
    const stateString = uuidv4();
    const scope = "user repo workflow";

    useEffect(() => {
        // After requesting GitHub access, GitHub redirects back to your app with a code parameter
        const url = window.location.href;
        const hasCode = url.includes("?code=");
        const hasState = url.includes("&state=")
        // If GitHub API returns the code parameter
        if (hasCode && hasState) {
            const newUrl = url.split("?code=");
            window.history.pushState({}, null, newUrl[0]);
            const loginRequest: LoginRequest = {
                code: newUrl[1].substring(0, newUrl[1].indexOf("&"))
            }
            dispatch(loginAsync(loginRequest))
        }
    }, [dispatch]);

    if (authData.login) {
        return <Navigate to="/"/>;
    }

    return <Card sx={{width: 700}}>
        <CardHeader
            title={"Compage"}
            subheader={"by Intelops"}
        />
        <CardMedia
            component="img"
            height="350"
            style={{objectFit: "scale-down"}}
            image={Logo}
            alt={"Login to Compage"}
        />
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Button variant="contained"
                        href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${stateString}`}
                        startIcon={<GitHubIcon/>}>
                    Login with Github
                </Button>
            </Box>
        </CardContent>
    </Card>
}
