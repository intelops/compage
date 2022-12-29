import React, {ChangeEvent, useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectCreateProjectStatus, selectListProjectsData, selectListProjectsStatus} from './slice';
import Button from "@mui/material/Button";
import {
    CreateProjectRequest,
    GetProjectRequest,
    ListProjectsRequest,
    ListProjectsResponse,
    Repository,
    User
} from "./model";
import {CompageEdge, CompageJson, CompageNode} from "../../components/diagram-maker/models";
import {selectAuthData} from "../auth/slice";
import {Navigate, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {listProjectsAsync} from "./async-apis/listProjects";
import {createProjectAsync} from "./async-apis/createProject";
import {getProjectAsync} from "./async-apis/getProject";

export const ChangeProject = () => {
    const createProjectStatus = useAppSelector(selectCreateProjectStatus);
    const authData = useAppSelector(selectAuthData);
    const listProjectsData = useAppSelector(selectListProjectsData);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const [data, setData] = useState({
        isOpen: false,
        projectName: "",
        isCreateNew: false,
        repositoryName: "",
        repositoryBranch: "",
        //TODO ui for this yet to be added.
        metadata: new Map<string, string>()
    });

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    const handleCreateProjectClick = () => {
        const createProjectRequest: CreateProjectRequest = prepareCreateProjectRequest()
        dispatch(createProjectAsync(createProjectRequest))
        setData({...data, projectName: "", repositoryBranch: "", repositoryName: "", isOpen: false})
    }

    const handleExistingProjectsChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            projectName: event.target.value
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleIsCreateNewChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            projectName: "",
            isCreateNew: event.target.checked
        });
    };

    const isValid = () => {
        if (data.isCreateNew) {
            for (const project of listProjectsData) {
                if (data.projectName === project.id) {
                    return false
                }
            }
        }
        return true;
    }

    const getRepositoryName = (): React.ReactNode => {
        if (data.isCreateNew) {
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
        }
        return ""
    }

    const getRepositoryBranch = (): React.ReactNode => {
        if (data.isCreateNew) {
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
        }
        return ""
    }

    const getProjectName = (): React.ReactNode => {
        if (data.isCreateNew) {
            return <TextField
                required
                fullWidth
                margin="dense"
                id="projectName"
                label="Name"
                type="text"
                value={data.projectName}
                onChange={handleNameChange}
                variant="outlined"
            />;
        }
        return "";
    }

    const getExistingProjects = (): React.ReactNode => {
        if (!data.isCreateNew) {
            return <TextField
                required
                fullWidth
                select
                disabled={data.isCreateNew}
                margin="dense"
                id="projectName"
                label="Existing Projects"
                type="text"
                value={data.projectName}
                onChange={handleExistingProjectsChange}
                variant="outlined">
                {
                    listProjectsData && listProjectsData.map((listProjectsResponse: ListProjectsResponse) =>
                        (
                            <MenuItem key={listProjectsResponse.id} value={listProjectsResponse.id}>
                                {listProjectsResponse.displayName} [{listProjectsResponse.id}]
                            </MenuItem>
                        )
                    )
                }
            </TextField>;
        }
        return ""
    }

    const prepareCreateProjectRequest = () => {
        const user: User = {
            email: authData.email || authData.login,
            name: authData.login
        }
        const repository: Repository = {
            branch: data.repositoryBranch || 'main',
            name: data.repositoryName,
            tag: "v1"
        }
        const json: CompageJson = {
            edges: new Map<string, CompageEdge>(),
            nodes: new Map<string, CompageNode>(),
            version: "v1"
        }
        const displayName = data.projectName;
        const metadata = data.metadata;
        const cPR: CreateProjectRequest = {
            metadata,
            version: "v1",
            repository,
            displayName,
            user: user,
            json: json
        };
        return cPR;
    };

    // When clicked, open the dialog
    const handleChangeProjectClick = () => {
        setData({...data, isOpen: true})
    };

    const handleChooseProjectClick = () => {
        console.log("handleChooseProjectClick clicked")
        // TODO Pull the selected project and set the yaml
        const getProjectRequest: GetProjectRequest = {
            id: data.projectName
        };
        dispatch(getProjectAsync(getProjectRequest))
        setData({...data, isOpen: false})
    }

    const getActionButtons = (): React.ReactNode => {
        if (!data.isCreateNew) {
            return <Button variant="contained"
                           onClick={handleChooseProjectClick}>
                Choose Project
            </Button>;
        }
        return <Button variant="contained"
                       onClick={handleCreateProjectClick}
                       disabled={createProjectStatus === 'loading' || data.projectName === "" || !isValid()}>
            Create Project
        </Button>
    }

    return <React.Fragment>
        <Dialog open={data.isOpen} onClose={handleClose}>
            <DialogTitle>Create/Choose Repo</DialogTitle>
            <Divider/>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <FormControlLabel
                        label="Create new?"
                        control={<Checkbox
                            size="medium"
                            checked={data.isCreateNew}
                            onChange={handleIsCreateNewChange}
                        />}
                    />
                    {getProjectName()}
                    {getRepositoryName()}
                    {getRepositoryBranch()}
                    {getExistingProjects()}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                {getActionButtons()}
            </DialogActions>
        </Dialog>
        <Button style={{
            width: "200px"
        }} variant="contained" onClick={handleChangeProjectClick}>
            Change Project
        </Button>
    </React.Fragment>
}
