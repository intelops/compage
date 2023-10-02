import React, {ChangeEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Card, CardActions, CardContent, CardMedia, Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import {sanitizeString} from "../../utils/backendApi";
import Button from "@mui/material/Button";
import {selectCreateGitPlatformStatus, selectUpdateGitPlatformStatus} from "./slice";
import {CreateGitPlatformRequest, UpdateGitPlatformRequest} from "./model";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import {createGitPlatformAsync} from "./async-apis/createGitPlatform";
import {updateGitPlatformAsync} from "./async-apis/updateGitPlatform";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {useNavigate} from "react-router-dom";

interface AddOrUpdateGitPlatformProps {
    name?: string;
    url?: string;
    personalAccessToken?: string;
    userName?: string;
}

export const AddOrUpdateGitPlatform = (addOrUpdateGitPlatformProps: AddOrUpdateGitPlatformProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const createGitPlatformStatus = useAppSelector(selectCreateGitPlatformStatus);
    const updateGitPlatformStatus = useAppSelector(selectUpdateGitPlatformStatus);

    const [payload, setPayload] = React.useState({
        name: addOrUpdateGitPlatformProps.name || "",
        url: addOrUpdateGitPlatformProps.url || "",
        userName: addOrUpdateGitPlatformProps.userName || "",
        personalAccessToken: addOrUpdateGitPlatformProps.personalAccessToken || "",
    });

    interface SupportedGitPlatform {
        name: string;
        url: string;
        isEnabled: boolean;
    }

    const supportedGitPlatforms = [
        {
            name: "github",
            url: "https://github.com",
            isEnabled: true
        },
        {
            name: "gitlab [upcoming]",
            url: "https://gitlab.com",
            isEnabled: false
        },
        {
            name: "bitbucket[upcoming]",
            url: "https://bitbucket.org",
            isEnabled: false
        }
    ];

    const handleAddOrUpdateGitPlatformClick = () => {
        if (addOrUpdateGitPlatformProps.name) {
            if (updateGitPlatformStatus !== 'loading') {
                const updateGitPlatformRequest: UpdateGitPlatformRequest = {
                    name: payload.name,
                    url: payload.url,
                    personalAccessToken: payload.personalAccessToken,
                    userName: payload.userName,
                    ownerEmail: getCurrentUser()
                };
                dispatch(updateGitPlatformAsync(updateGitPlatformRequest));
            }
        } else {
            if (createGitPlatformStatus !== 'loading') {
                const createGitPlatformRequest: CreateGitPlatformRequest = {
                    name: payload.name,
                    url: payload.url,
                    personalAccessToken: payload.personalAccessToken,
                    userName: payload.userName,
                    ownerEmail: getCurrentUser()
                };
                dispatch(createGitPlatformAsync(createGitPlatformRequest));
            }
        }
        setPayload({
            name: "",
            url: "",
            personalAccessToken: "",
            userName: "",
        });
        navigate('/git-platforms');
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            name: sanitizeString(event.target.value),
            url: supportedGitPlatforms.find((supportedGitPlatform: SupportedGitPlatform) => supportedGitPlatform.name === event.target.value)?.url || ""
        });
    };

    const handleUrlChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            url: sanitizeString(event.target.value)
        });
    };

    const handleUserNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            userName: event.target.value
        });
    };

    const handlePersonalAccessTokenChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            personalAccessToken: event.target.value
        });
    };

    const getName = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            select
            margin="dense"
            id="name"
            label="Git Platform"
            type="text"
            value={payload.name}
            onChange={handleNameChange}
            variant="outlined">
            {
                supportedGitPlatforms.map((supportedGitPlatform: SupportedGitPlatform) =>
                    (
                        <MenuItem key={supportedGitPlatform.name} value={supportedGitPlatform.name}
                                  disabled={!supportedGitPlatform.isEnabled}>
                            {supportedGitPlatform.name}
                        </MenuItem>
                    )
                )
            }
        </TextField>;
    };

    const getURL = (): React.ReactNode => {
        return <TextField
            fullWidth
            required
            margin="dense"
            id="url"
            label="URL"
            type="text"
            disabled
            value={payload.url}
            onChange={handleUrlChange}
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

    const getPersonalAccessToken = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="personalAccessToken"
            label="Personal Access Token"
            type="password"
            value={payload.personalAccessToken}
            onChange={handlePersonalAccessTokenChange}
            variant="outlined"
        />;
    };

    const getActionButtons = (): React.ReactNode => {
        return <>
            <Button variant="contained"
                    onClick={handleAddOrUpdateGitPlatformClick}
                    disabled={createGitPlatformStatus === 'loading' || payload.name === "" || payload.url === "" || payload.personalAccessToken === "" || payload.userName === ""}>
                Add a GitPlatform
            </Button>
            <Button variant="outlined" color="error" onClick={() => {
                navigate("/git-platforms");
            }}>
                Cancel
            </Button>
        </>;
    };

    return <Stack direction="column">
        <Typography variant={"h6"}>Add a GitPlatform</Typography>
        <Card variant="outlined" sx={{maxWidth: 345}}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="https://www.20i.com/blog/wp-content/uploads/2022/08/git-blog-header.png">

            </CardMedia>
            <CardContent>
                {getName()}
                {getURL()}
                {getUserName()}
                {getPersonalAccessToken()}
            </CardContent>
            <CardActions>
                {getActionButtons()}
            </CardActions>
        </Card>
    </Stack>;
};
