import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import {useAppSelector} from "../../hooks/redux-hooks";
import {Navigate} from "react-router-dom";
import {selectData} from "../auth/slice";

export const Account = () => {
    const auth = useAppSelector(selectData);
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
    } = auth
    if (!auth.login) {
        return <Navigate to="/login"/>;
    }
    let title = name
    if (email) {
        title += "[" + email + "]"
    }
    return <Card sx={{width: 700}}>
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
}
