import * as React from 'react';
import {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Navigate} from "react-router-dom";
import {selectAuthData} from "../../features/auth/slice";
import {selectListProjectsData} from "../../features/projects/slice";
import {ListProjectsRequest} from "../../features/projects/model";
import {listProjectsAsync} from "../../features/projects/async-apis/listProjects";
import Box from '@mui/material/Box';
import {Stack} from "@mui/material";

export const Account = () => {
    const authData = useAppSelector(selectAuthData);
    const listProjectsData = useAppSelector(selectListProjectsData);
    const dispatch = useAppDispatch();

    const {
        avatar_url,
        bio,
        name,
        public_repos,
        owned_private_repos,
        followers,
        following,
        login,
        email
    } = authData;

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {};
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch]);

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    let title = name;
    if (email) {
        title += "[" + email + "]";
    }
    console.log("listProjectsData : ", listProjectsData);
    const listItems = listProjectsData && listProjectsData.map((d) =>
        <li key={d.id}>
            {d.id}
        </li>
    );

    return <>
        <Stack direction="column" spacing={2}>
            <Card sx={{width: 700}}>
                <CardHeader
                    avatar={
                        <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                        </Avatar>
                    }
                    title={title}
                    subheader={login}
                />
                <CardMedia
                    component="img"
                    height="350"
                    image={avatar_url}
                    alt={name}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {bio}
                    </Typography>
                    <hr/>
                    <Typography variant="body2">
                        {followers} followers <br/>
                        {following} following <br/>
                        {public_repos} public_repos <br/>
                        {owned_private_repos} owned_private_repos
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{flexGrow: 0}}>
                <Typography variant={"h6"}> You have created below projects so far.
                </Typography>
                <ul>
                    {listItems}
                </ul>
            </Box>
        </Stack>
    </>;
};
