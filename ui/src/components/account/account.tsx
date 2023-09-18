import * as React from 'react';
import {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectListProjectsData} from "../../features/projects-operations/slice";
import {ListProjectsRequest} from "../../features/projects-operations/model";
import {listProjectsAsync} from "../../features/projects-operations/async-apis/listProjects";
import Box from '@mui/material/Box';
import {Stack} from "@mui/material";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import {ListGitPlatforms} from "../../features/git-platforms-operations/list-git-platforms";
import {getCurrentUser} from "../../utils/sessionstorage-client";
import {GitPlatforms} from "../../features/git-platforms-operations/git-platforms";

export const Account = () => {
    const listProjectsData = useAppSelector(selectListProjectsData);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {
            email: getCurrentUser()
        };
        dispatch(listProjectsAsync(listProjectsRequest));
        const getCurrentProjectContext: GetCurrentContextRequest = {
            email: getCurrentUser()
        };
        dispatch(getCurrentContextAsync(getCurrentProjectContext));
    }, [dispatch]);

    const listItems = listProjectsData && listProjectsData.map((d) =>
        <li key={d.id}>
            {d.displayName}[{d.id}] at {d.version} <a target="_blank" href={d.repositoryUrl}>{d.repositoryUrl}</a>
        </li>
    );

    return <>
        <Stack direction="column" spacing={2}>
            <Box sx={{flexGrow: 0}}>
                <Typography variant={"h6"}> You({getCurrentUser()}) have created below projects so far.
                </Typography>
                <ul>
                    {listItems}
                </ul>
            </Box>
            <Box sx={{flexGrow: 0}}>
                <GitPlatforms/>
            </Box>
        </Stack>
    </>;
};
