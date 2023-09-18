import React, {ChangeEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import {sanitizeString} from "../../utils/backend-api";
import Button from "@mui/material/Button";
import {selectCreateGitPlatformStatus} from "./slice";
import {CreateGitPlatformRequest} from "./model";
import {getCurrentUser} from "../../utils/sessionstorage-client";
import {createGitPlatformAsync} from "./async-apis/create-git-platform";

export const CreateGitPlatform = () => {
    const dispatch = useAppDispatch();
    const createGitPlatformStatus = useAppSelector(selectCreateGitPlatformStatus);
    const [payload, setPayload] = React.useState({
        name: "",
        url: "",
        personalAccessToken: "",
        userName: "",
    });

    const handleCreateGitPlatformClick = () => {
        const createGitPlatformRequest: CreateGitPlatformRequest = {
            name: payload.name,
            url: payload.url,
            personalAccessToken: payload.personalAccessToken,
            userName: payload.userName,
            ownerEmail: getCurrentUser()
        };
        dispatch(createGitPlatformAsync(createGitPlatformRequest));
        setPayload({
            name: "",
            url: "",
            personalAccessToken: "",
            userName: "",
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: sanitizeString(event.target.value)
        });
    };

    const handleUrlChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            url: sanitizeString(event.target.value)
        });
    };

    const handlePersonalAccessTokenChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            personalAccessToken: event.target.value
        });
    };

    const handleUserNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            userName: event.target.value
        });
    };

    const getName = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={payload.name}
            onChange={handleNameChange}
            variant="outlined"
        />;
    };

    const getURL = (): React.ReactNode => {
        return <TextField
            fullWidth
            required
            margin="dense"
            id="url"
            label="URL"
            type="text"
            value={payload.url}
            onChange={handleUrlChange}
            variant="outlined"
        />;
    };

    const getPersonalAccessToken = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="personalAccessToken"
            label="Personal Access Token"
            type="text"
            value={payload.personalAccessToken}
            onChange={handlePersonalAccessTokenChange}
            variant="outlined"
        />;
    };

    const getUserName = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="userName"
            label="UserName"
            type="text"
            value={payload.userName}
            onChange={handleUserNameChange}
            variant="outlined"
        />;
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       onClick={handleCreateGitPlatformClick}
                       disabled={createGitPlatformStatus === 'loading' || payload.name === "" || payload.url === "" || payload.personalAccessToken === "" || payload.userName === ""}>
            Add GitPlatform
        </Button>;
    };

    return <>
        Create a GitPlatform
        <Stack direction="column" spacing={2}>
            {getName()}
            {getURL()}
            {getPersonalAccessToken()}
            {getUserName()}
            {getActionButtons()}
        </Stack>
    </>;
};
