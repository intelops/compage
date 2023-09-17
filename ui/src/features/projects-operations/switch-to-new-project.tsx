import React, {ChangeEvent, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectCreateProjectStatus, selectListProjectsData} from './slice';
import Button from "@mui/material/Button";
import {CreateProjectRequest} from "./model";
import TextField from "@mui/material/TextField";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {createProjectAsync} from "./async-apis/createProject";
import {getData} from "../../components/diagram-maker/data/BoundaryCircular/data";
import {sanitizeString} from "../../utils/backend-api";
import {getCurrentUser} from "../../utils/sessionstorage-client";

interface ArgTypes {
    handleClose: (...args: any) => void;
}

export const SwitchToNewProject = ({handleClose}: ArgTypes) => {
    const createProjectStatus = useAppSelector(selectCreateProjectStatus);
    const listProjectsData = useAppSelector(selectListProjectsData);

    const dispatch = useAppDispatch();

    const [data, setData] = useState({
        projectName: "",
        repositoryName: "",
        isPublicRepository: true,
        repositoryBranch: "",
        // TODO ui for this yet to be added.
        metadata: new Map<string, string>()
    });

    const handleCreateProjectClick = () => {
        const createProjectRequest: CreateProjectRequest = prepareCreateProjectRequest();
        dispatch(createProjectAsync(createProjectRequest));
        if (handleClose) {
            handleClose();
        }
    };

    const handleProjectNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            projectName: sanitizeString(event.target.value)
        });
    };

    const handleRepositoryBranchChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            repositoryBranch: sanitizeString(event.target.value)
        });
    };

    const handleRepositoryNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            repositoryName: sanitizeString(event.target.value)
        });
    };

    const handleIsPublicRepositoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            isPublicRepository: event.target.checked
        });
    };

    const isValid = () => {
        for (const project of listProjectsData) {
            if (data.projectName === project.id) {
                return false;
            }
        }
        return true;
    };

    const getIsRepositoryPublic = (): React.ReactNode => {
        return <FormControlLabel
            label="Is Public Repository?"
            control={<Checkbox
                id="isPublicRepository"
                size="medium" checked={data.isPublicRepository}
                onChange={handleIsPublicRepositoryChange}
            />}
        />;
    };

    const getRepositoryName = (): React.ReactNode => {
        return <TextField
            fullWidth
            margin="dense"
            id="repositoryName"
            label="Repository Name"
            type="text"
            value={data.repositoryName}
            onChange={handleRepositoryNameChange}
            variant="outlined"
        />;
    };

    const getRepositoryBranch = (): React.ReactNode => {
        return <TextField
            fullWidth
            margin="dense"
            id="repositoryBranch"
            label="Repository Branch"
            type="text"
            value={data.repositoryBranch}
            onChange={handleRepositoryBranchChange}
            variant="outlined"
        />;
    };

    const getProjectName = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="projectName"
            label="Name"
            type="text"
            value={data.projectName}
            onChange={handleProjectNameChange}
            variant="outlined"
        />;
    };

    const prepareCreateProjectRequest = () => {
        // TODO below is a hack. Need to find a way to get the correct user details.
        const gitPlatform = {
            name: "github",
            userName: "mahendraintelops",
            url: 'https://api.github.com',
            token: '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'
        };
        const json = getData(0, 0, "");
        const displayName = data.projectName;
        const metadata = data.metadata;
        const cPR: CreateProjectRequest = {
            id: "",
            metadata,
            version: "v1",
            gitPlatformName: gitPlatform.name,
            gitPlatformUserName: gitPlatform.userName,
            repositoryName: data.repositoryName,
            repositoryBranch: data.repositoryBranch || 'compage',
            isRepositoryPublic: data.isPublicRepository,
            displayName,
            ownerEmail: getCurrentUser(),
            json: JSON.parse(JSON.stringify(json))
        };
        return cPR;
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       onClick={handleCreateProjectClick}
                       disabled={createProjectStatus === 'loading' || data.projectName === "" || !isValid()}>
            Create Project
        </Button>;
    };

    return <React.Fragment>
        <Stack direction="column" spacing={2}>
            {getProjectName()}
            {getRepositoryName()}
            {getRepositoryBranch()}
            {getIsRepositoryPublic()}
            {getActionButtons()}
        </Stack>
    </React.Fragment>;
};
