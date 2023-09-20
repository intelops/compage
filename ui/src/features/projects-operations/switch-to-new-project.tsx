import React, {ChangeEvent, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectCreateProjectStatus, selectListProjectsData} from './slice';
import Button from "@mui/material/Button";
import {CreateProjectRequest} from "./model";
import TextField from "@mui/material/TextField";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import {createProjectAsync} from "./async-apis/createProject";
import {getData} from "../../components/diagram-maker/data/BoundaryCircular/data";
import {sanitizeString} from "../../utils/backendApi";
import {getCurrentUser} from "../../utils/sessionstorageClient";
import MenuItem from "@mui/material/MenuItem";
import {selectListGitPlatformsData, selectListGitPlatformsStatus} from "../git-platforms-operations/slice";
import {GitPlatformDTO} from "../git-platforms-operations/model";
import {Link} from "react-router-dom";

interface ArgTypes {
    handleClose: (...args: any) => void;
}

export const SwitchToNewProject = ({handleClose}: ArgTypes) => {
    const createProjectStatus = useAppSelector(selectCreateProjectStatus);
    const listProjectsData = useAppSelector(selectListProjectsData);
    const listGitPlatformsData = useAppSelector(selectListGitPlatformsData);
    const listGitPlatformsStatus = useAppSelector(selectListGitPlatformsStatus);

    const dispatch = useAppDispatch();

    const [payload, setPayload] = useState({
        projectName: "",
        repositoryName: "",
        isPublicRepository: true,
        repositoryBranch: "",
        gitPlatform: {
            userName: "",
            name: "",
            url: ""
        },
        // TODO ui for this yet to be added.
        metadata: new Map<string, string>()
    });

    const prepareCreateProjectRequest = () => {
        const json = getData(0, 0, "");
        const displayName = payload.projectName;
        const metadata = payload.metadata;
        const cPR: CreateProjectRequest = {
            id: "",
            metadata,
            version: "v1",
            gitPlatformName: payload.gitPlatform.name,
            gitPlatformUserName: payload.gitPlatform.userName,
            repositoryName: payload.repositoryName,
            repositoryBranch: payload.repositoryBranch || 'compage',
            isRepositoryPublic: payload.isPublicRepository,
            repositoryUrl: payload.gitPlatform.url + '/' + payload.gitPlatform.userName + '/' + payload.repositoryName,
            displayName,
            ownerEmail: getCurrentUser(),
            json: JSON.parse(JSON.stringify(json))
        };
        return cPR;
    };

    const handleCreateProjectClick = () => {
        const createProjectRequest: CreateProjectRequest = prepareCreateProjectRequest();
        dispatch(createProjectAsync(createProjectRequest));
        if (handleClose) {
            handleClose();
        }
    };

    const handleGitPlatformsChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const gitPlatformName = event.target.value;
        const gitPlatform = listGitPlatformsData.find((gitPlatformDTO: GitPlatformDTO) => gitPlatformDTO.name === gitPlatformName);
        if (gitPlatform) {
            setPayload({
                ...payload,
                gitPlatform: {
                    name: gitPlatform.name,
                    userName: gitPlatform.userName,
                    url: gitPlatform.url
                }
            });
        }
    };

    const handleProjectNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            projectName: sanitizeString(event.target.value)
        });
    };

    const handleRepositoryBranchChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            repositoryBranch: sanitizeString(event.target.value)
        });
    };

    const handleRepositoryNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setPayload({
            ...payload,
            repositoryName: sanitizeString(event.target.value)
        });
    };

    const handleIsPublicRepositoryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPayload({
            ...payload,
            isPublicRepository: event.target.checked
        });
    };

    const isValid = () => {
        for (const project of listProjectsData) {
            if (payload.projectName === project.id) {
                return false;
            }
        }
        return true;
    };

    const getProjectName = (): React.ReactNode => {
        return <TextField
            required
            fullWidth
            margin="dense"
            id="projectName"
            label="Name"
            type="text"
            value={payload.projectName}
            onChange={handleProjectNameChange}
            variant="outlined"
        />;
    };

    const getGitPlatforms = (): React.ReactNode => {
        if (listGitPlatformsData && listGitPlatformsData.length === 0) {
            return <>
                <Link to="/account">
                    Add Git Platform
                </Link>
                <TextField
                    required
                    fullWidth
                    select
                    disabled={listGitPlatformsStatus === 'loading' || (listGitPlatformsData && listGitPlatformsData.length === 0)}
                    margin="dense"
                    id="gitPlatform"
                    label="Git Platforms"
                    type="text"
                    onChange={handleGitPlatformsChange}
                    variant="outlined">
                    {
                        listGitPlatformsData && listGitPlatformsData.map((gitPlatformDTO: GitPlatformDTO) =>
                            (
                                <MenuItem key={gitPlatformDTO.name} value={gitPlatformDTO.name}>
                                    {gitPlatformDTO.name} [{gitPlatformDTO.userName}]
                                </MenuItem>
                            )
                        )
                    }
                </TextField>
            </>;
        }
        return <TextField
            required
            fullWidth
            select
            disabled={listGitPlatformsStatus === 'loading' || (listGitPlatformsData && listGitPlatformsData.length === 0)}
            margin="dense"
            id="gitPlatform"
            label="Git Platforms"
            type="text"
            onChange={handleGitPlatformsChange}
            variant="outlined">
            {
                listGitPlatformsData && listGitPlatformsData.map((gitPlatformDTO: GitPlatformDTO) =>
                    (
                        <MenuItem key={gitPlatformDTO.name} value={gitPlatformDTO.name}>
                            {gitPlatformDTO.name} [{gitPlatformDTO.userName}]
                        </MenuItem>
                    )
                )
            }
        </TextField>;
    };

    const getRepositoryName = (): React.ReactNode => {
        return <TextField
            fullWidth
            margin="dense"
            id="repositoryName"
            label="Repository Name"
            type="text"
            value={payload.repositoryName}
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
            value={payload.repositoryBranch}
            onChange={handleRepositoryBranchChange}
            variant="outlined"
        />;
    };

    const getIsRepositoryPublic = (): React.ReactNode => {
        return <FormControlLabel
            label="Is Public Repository?"
            control={<Checkbox
                id="isPublicRepository"
                size="medium" checked={payload.isPublicRepository}
                onChange={handleIsPublicRepositoryChange}
            />}
        />;
    };

    const getActionButtons = (): React.ReactNode => {
        return <Button variant="contained"
                       onClick={handleCreateProjectClick}
                       disabled={createProjectStatus === 'loading' || payload.projectName === "" || payload.gitPlatform.name === "" || !isValid()}>
            Create Project
        </Button>;
    };

    return <React.Fragment>
        <Stack direction="column" spacing={2}>
            {getProjectName()}
            {getGitPlatforms()}
            {getRepositoryName()}
            {getRepositoryBranch()}
            {getIsRepositoryPublic()}
            {getActionButtons()}
        </Stack>
    </React.Fragment>;
};
