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
import {getCurrentUser} from "../../utils/sessionstorageClient";

interface ArgTypes {
    handleClose: (...args: any) => void;
}

export const SwitchToExistingProject = ({handleClose}: ArgTypes) => {
    const listProjectsStatus = useAppSelector(selectListProjectsStatus);
    const listProjectsData = useAppSelector(selectListProjectsData);
    const getProjectStatus = useAppSelector(selectGetProjectStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        // dispatch listProjects
        const listProjectsRequest: ListProjectsRequest = {
            email: getCurrentUser()
        };
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [dispatch]);

    const [data, setData] = useState({
        projectName: "",
    });

    const handleExistingProjectsChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            projectName: event.target.value
        });
    };

    const handleChooseProjectClick = () => {
        // allow to choose project only when the project is chosen from drop-down
        if (data.projectName) {
            const getProjectRequest: GetProjectRequest = {
                id: data.projectName,
                email: getCurrentUser()
            };
            dispatch(getProjectAsync(getProjectRequest));
            if (handleClose) {
                handleClose();
            }
        }
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       disabled={listProjectsStatus === 'loading' || getProjectStatus === 'loading' || data.projectName === ''}
                       onClick={handleChooseProjectClick}>
            Choose Project
        </Button>;
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
            value={data.projectName}
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

    const getLoadingIcon = () => {
        if (listProjectsStatus === 'loading') {
            return <CircularProgress/>;
        }
        return;
    };

    return <React.Fragment>
        <Stack sx={{display: 'flex', alignSelf: "center"}} direction="column" spacing={2}>
            {getLoadingIcon()}
        </Stack>
        {getExistingProjects()}
        {getActionButtons()}
    </React.Fragment>;
};
