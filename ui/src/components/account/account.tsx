import * as React from 'react';
import {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectListProjectsData} from "../../features/projects-operations/slice";
import {ListProjectsRequest} from "../../features/projects-operations/model";
import {listProjectsAsync} from "../../features/projects-operations/async-apis/listProjects";
import Box from '@mui/material/Box';
import {Stack} from "@mui/material";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import TextField from "@mui/material/TextField";
import {ListGitPlatforms} from "../../features/git-platforms-operations/list-git-platforms";

export const Account = () => {
    const listProjectsData = useAppSelector(selectListProjectsData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {};
        dispatch(listProjectsAsync(listProjectsRequest));
        const getCurrentProjectContext: GetCurrentContextRequest = {};
        dispatch(getCurrentContextAsync(getCurrentProjectContext));
    }, [dispatch]);

    const listItems = listProjectsData && listProjectsData.map((d) =>
        <li key={d.id}>
            {d.id}
        </li>
    );

    return <>
        <Stack direction="column" spacing={2}>
            <Box sx={{flexGrow: 0}}>
                <Typography variant={"h6"}> You have created below projects so far.
                </Typography>
                <ul>
                    {listItems}
                </ul>
            </Box>
            <Box sx={{flexGrow: 0}}>
                <Typography variant={"h6"}> Git Platforms Configuration </Typography>
                <Typography variant={"h6"}> Existing git platforms. </Typography>
                <ul>
                    <ListGitPlatforms/>
                </ul>
                <Card sx={{width: 700}}>
                    <CardHeader
                        title="GitHub"
                    />
                    <CardContent>
                        <TextField
                            required
                            size="medium"
                            margin="dense"
                            id="provider"
                            label="Provider"
                            type="text"
                            value=""
                            variant="outlined"
                        />
                        <TextField
                            required
                            size="medium"
                            margin="dense"
                            id="providerUrl"
                            label="Provider Url"
                            type="text"
                            value=""
                            variant="outlined"
                        />
                        <hr/>
                    </CardContent>
                </Card>
            </Box>
        </Stack>
    </>;
};
