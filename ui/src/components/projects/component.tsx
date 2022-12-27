import React, {ChangeEvent, useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectCreateProjectStatus, selectListProjectsData, selectListProjectsStatus} from './slice';
import Button from "@mui/material/Button";
import {CreateProjectRequest, ListProjectsRequest, ListProjectsResponse, Repository, User} from "./model";
import {CompageJson} from "../diagram-maker/models";
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

export const ChangeProject = () => {
    const createProjectStatus = useAppSelector(selectCreateProjectStatus);
    const listProjectsStatus = useAppSelector(selectListProjectsStatus);
    const authData = useAppSelector(selectAuthData);
    const listProjectsData = useAppSelector(selectListProjectsData);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const [data, setData] = useState({
        errorMessage: "",
        isOpen: false,
        projectName: "",
        isCreateNew: false,
        repositoryName: "",
        repositoryBranch: "",
        metadata: ""
    });

    useEffect(() => {
        // dispatch listProjects
        dispatch(listProjectsAsync(listProjectsRequest));
    }, [])

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    const handleCreateProjectClick = () => {
        console.log("handleCreateProjectClick clicked");
        console.log(JSON.stringify(data));
        // // give a call to create project if it's new
        // if (data.isCreateNew) {
        //     // TODO
        //     // dispatch(createProjectAsync(createProjectRequest));
        //     // authData.login, data.currentProject, data.description
        //     // use above data to create new project
        // }
        // // set the current repository retails post response from server
        // // give call to pull the latest contents
        // const currentRepositoryDetails = {
        //     repositoryName: data.projectName,
        //     // TODO
        //     details: "githubRepositoryContent"
        // }
        // setCurrentRepositoryDetails(JSON.stringify(currentRepositoryDetails))
        // setData({...data, isOpen: false})
        // navigate('/home');
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
            email: authData.email, name: authData.name
        }
        const repository: Repository = {branch: data.repositoryBranch || 'main', name: data.repositoryName, tag: ""}
        const yaml: CompageJson = {edges: undefined, nodes: undefined, version: ""}
        const displayName = data.projectName;
        const metadata = data.metadata;
        return JSON.parse("{\n" +
            "    \"user\": {\n" +
            "        \"name\": \"mahendraintelops\",\n" +
            "        \"email\": \"mahendra.b@intelops.dev\"\n" +
            "    },\n" +
            "    \"repository\": {\n" +
            "        \"name\": \"first-project11\",\n" +
            "        \"branch\": \"main\"\n" +
            "    },\n" +
            "    \"displayName\": \"first-project\",\n" +
            "    \"version\": \"v1\",\n" +
            "    \"yaml\": {\n" +
            "        \"edges\": {\n" +
            "            \"edge1\": {\n" +
            "                \"id\": \"edge1\",\n" +
            "                \"src\": \"node1\",\n" +
            "                \"dest\": \"node2\",\n" +
            "                \"consumerData\": {\n" +
            "                    \"externalNodeName\": \"servicea\",\n" +
            "                    \"clientTypes\": [\n" +
            "                        {\n" +
            "                            \"port\": \"9999\",\n" +
            "                            \"protocol\": \"REST\"\n" +
            "                        }\n" +
            "                    ],\n" +
            "                    \"metadata\": {},\n" +
            "                    \"annotations\": {}\n" +
            "                }\n" +
            "            }\n" +
            "        },\n" +
            "        \"nodes\": {\n" +
            "            \"node1\": {\n" +
            "                \"id\": \"node1\",\n" +
            "                \"typeId\": \"node-type-circle\",\n" +
            "                \"consumerData\": {\n" +
            "                    \"name\": \"ServiceA\",\n" +
            "                    \"template\": \"compage\",\n" +
            "                    \"serverTypes\": [\n" +
            "                        {\n" +
            "                            \"protocol\": \"REST\",\n" +
            "                            \"port\": \"9999\",\n" +
            "                            \"framework\": \"net/http\",\n" +
            "                            \"resources\": [\n" +
            "                                {\n" +
            "                                    \"Name\": \"User\",\n" +
            "                                    \"Fields\": {\n" +
            "                                        \"id\": \"string\",\n" +
            "                                        \"name\": \"string\",\n" +
            "                                        \"city\": \"string\",\n" +
            "                                        \"mobileNumber\": \"string\"\n" +
            "                                    }\n" +
            "                                },\n" +
            "                                {\n" +
            "                                    \"Name\": \"Account\",\n" +
            "                                    \"Fields\": {\n" +
            "                                        \"id\": \"string\",\n" +
            "                                        \"branch\": \"string\",\n" +
            "                                        \"city\": \"string\"\n" +
            "                                    }\n" +
            "                                }\n" +
            "                            ]\n" +
            "                        }\n" +
            "                    ],\n" +
            "                    \"language\": \"Golang\",\n" +
            "                    \"metadata\": {},\n" +
            "                    \"annotations\": {}\n" +
            "                }\n" +
            "            },\n" +
            "            \"node2\": {\n" +
            "                \"id\": \"node2\",\n" +
            "                \"typeId\": \"node-type-rectangle\",\n" +
            "                \"consumerData\": {\n" +
            "                    \"template\": \"compage\",\n" +
            "                    \"name\": \"ServiceB\",\n" +
            "                    \"language\": \"Golang\",\n" +
            "                    \"metadata\": {},\n" +
            "                    \"annotations\": {}\n" +
            "                }\n" +
            "            }\n" +
            "        },\n" +
            "        \"version\": \"v1\"\n" +
            "    },\n" +
            "    \"metadata\": {\n" +
            "        \"test\": \"123\"\n" +
            "    }\n" +
            "}");
    };
    // TODO refer selected project here
    const createProjectRequest: CreateProjectRequest = prepareCreateProjectRequest()
    const listProjectsRequest: ListProjectsRequest = {}

    // When clicked, open the dialog
    const handleChangeProjectClick = () => {
        setData({...data, isOpen: true})
    };

    const handleChooseProjectClick = () => {
        console.log("handleChooseProjectClick clicked")
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
            {createProjectStatus === 'loading'
                ? "Creating Project"
                : "Create Project"}
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
