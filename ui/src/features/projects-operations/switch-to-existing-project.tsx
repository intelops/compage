import React, {ChangeEvent, useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectGetProjectStatus, selectListProjectsData, selectListProjectsStatus} from './slice';
import Button from "@mui/material/Button";
import {GetProjectRequest, ListProjectsRequest, ProjectDTO} from "./model";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {Stack} from "@mui/material";
import {getProjectAsync} from "./async-apis/getProject";
import {listProjectsAsync} from "./async-apis/listProjects";
import CircularProgress from '@mui/material/CircularProgress';
import {getCurrentUser, isUserNotLoggedIn} from "../../utils/sessionstorageClient";
import {useNavigate} from "react-router-dom";

interface SwitchToExistingProjectProps {
}

export const SwitchToExistingProject = (_switchToExistingProjectProps: SwitchToExistingProjectProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const listProjectsData = useAppSelector(selectListProjectsData);
    const listProjectsStatus = useAppSelector(selectListProjectsStatus);
    const getProjectStatus = useAppSelector(selectGetProjectStatus);

    const [payload, setPayload] = useState({
        projectName: "",
    });

    useEffect(() => {
        if (isUserNotLoggedIn()) {
            navigate('/login');
        }
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {
            email: getCurrentUser()
        };
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch, navigate]);

    const handleChooseProjectClick = () => {
        // allow to choose project only when the project is chosen from drop-down
        if (payload.projectName) {
            const getProjectRequest: GetProjectRequest = {
                id: payload.projectName,
                email: getCurrentUser()
            };
            dispatch(getProjectAsync(getProjectRequest));
        }
        console.log("handleChooseProjectClick called");
        navigate('/home');
    };

    const handleExistingProjectsChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            projectName: event.target.value
        });
    };

    const getLoadingIcon = (): React.ReactNode => {
        if (listProjectsStatus === 'loading') {
            return <CircularProgress/>;
        }
        return "";
    };

    const getExistingProjects = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            select
            disabled={listProjectsStatus === 'loading' || (listProjectsData && listProjectsData.length === 0)}
            margin="dense"
            id="projectName"
            label="Existing Projects"
            type="text"
            value={payload.projectName}
            onChange={handleExistingProjectsChange}
            variant="outlined">
            {
                listProjectsData && listProjectsData.map((projectDTO: ProjectDTO) =>
                    (
                        <MenuItem key={projectDTO.id} value={projectDTO.id}>
                            {projectDTO.displayName} [{projectDTO.id}]
                        </MenuItem>
                    )
                )
            }
        </TextField>;
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       disabled={listProjectsStatus === 'loading' || getProjectStatus === 'loading' || payload.projectName === ''}
                       onClick={handleChooseProjectClick}>
            Choose Project
        </Button>;
    };

    return <React.Fragment>
        <Stack sx={{display: 'flex', alignSelf: "center"}} direction="column" spacing={2}>
            {getLoadingIcon()}
        </Stack>
        {getExistingProjects()}
        {getActionButtons()}
    </React.Fragment>;
};
