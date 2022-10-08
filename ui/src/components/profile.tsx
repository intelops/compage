import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';
import {useAppSelector} from "../hooks/redux-hooks";

export const ProfileCard = () => {
    const authentication = useAppSelector(state => state.authentication);
    const {avatar_url, bio, name, public_repos, followers, following} = authentication.user

    return (
        <Card sx={{maxWidth: 345}}>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                    </Avatar>
                }
                title={name}
                subheader={new Date().toLocaleDateString()}
            />
            <CardMedia
                component="img"
                height="194"
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
                    {public_repos} public_repos
                </Typography>
            </CardContent>
        </Card>
    );
}
