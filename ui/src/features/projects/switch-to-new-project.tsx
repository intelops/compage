import React, {ChangeEvent, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectCreateProjectStatus, selectListProjectsData} from './slice';
import Button from "@mui/material/Button";
import {CreateProjectRequest, Repository, User} from "./model";
import {selectAuthData} from "../auth/slice";
import {Navigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {Stack} from "@mui/material";
import {createProjectAsync} from "./async-apis/createProject";
import {getData} from "../../components/diagram-maker/data/BoundaryCircular/data";

interface ArgTypes {
    handleClose: (...args: any) => void;
}

export const SwitchToNewProject = ({handleClose}: ArgTypes) => {
    const createProjectStatus = useAppSelector(selectCreateProjectStatus);
    const authData = useAppSelector(selectAuthData);
    const listProjectsData = useAppSelector(selectListProjectsData);

    const dispatch = useAppDispatch();

    const [data, setData] = useState({
        projectName: "",
        repositoryName: "",
        repositoryBranch: "",
        //TODO ui for this yet to be added.
        metadata: new Map<string, string>()
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleCreateProjectClick = () => {
        const createProjectRequest: CreateProjectRequest = prepareCreateProjectRequest();
        dispatch(createProjectAsync(createProjectRequest));
        handleClose();
    };

    const handleProjectNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            projectName: event.target.value
        });
    };

    const handleRepositoryBranchChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            repositoryBranch: event.target.value
        });
    };

    const handleRepositoryNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            repositoryName: event.target.value
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
        const user: User = {
            email: authData.email || authData.login,
            name: authData.login
        };
        const repository: Repository = {
            branch: data.repositoryBranch || 'compage',
            name: data.repositoryName,
            tag: "v1"
        };
        const json = getData(0, 0);
        const displayName = data.projectName;
        const metadata = data.metadata;
        const cPR: CreateProjectRequest = {
            id: "",
            metadata,
            version: "v1",
            repository,
            displayName,
            user,
            json: JSON.stringify(json)
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
            {getActionButtons()}
        </Stack>
    </React.Fragment>;
};
