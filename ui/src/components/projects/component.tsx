import React, {ChangeEvent, useEffect, useState} from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectProjectsData, selectProjectsStatus} from './slice';
import Button from "@mui/material/Button";
import {CreateProjectRequest, ListProjectsRequest, Repository, User} from "./model";
import {CompageYaml} from "../diagram-maker/models";
import {selectAuthData} from "../auth/slice";
import {createProjectAsync} from "./async-apis/createProject";
import {Navigate, useNavigate} from "react-router-dom";
import {setCurrentRepositoryDetails} from "../../utils/service";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";

export const CreateProject = () => {
    const projectsStatus = useAppSelector(selectProjectsStatus);
    const authData = useAppSelector(selectAuthData);
    const projectsData = useAppSelector(selectProjectsData);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const [data, setData] = useState({
        errorMessage: "",
        isLoading: false,
        isOpen: false,
        projectName: "",
        isCreateNew: false,
        repositoryName: "",
        repositoryBranch: "",
        metadata: ""
    });

    useEffect(() => {
        // dispatch listProjects
        // dispatch(listProjectsAsync(listProjectsRequest));
        setData({...data, isLoading: projectsStatus === 'loading'})
    }, [setData])

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    // if (projectsData.length > 0 && projectsStatus !== 'loading') {
    //     setData({...data, isOpen: true, isLoading: false})
    // }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    const handleCreate = () => {
        // give a call to create project if it's new
        if (data.isCreateNew) {
            // TODO
            dispatch(createProjectAsync(createProjectRequest));
            // authData.login, data.currentProject, data.description
            // use above data to create new project
        }
        // set the current repository retails post response from server
        // give call to pull the latest contents
        const currentRepositoryDetails = {
            repositoryName: data.projectName,
            //TODO
            details: "githubRepositoryContent"
        }
        setCurrentRepositoryDetails(JSON.stringify(currentRepositoryDetails))
        setData({...data, isOpen: false})
        navigate('/home');
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
            isCreateNew: event.target.checked
        });
    };

    const isValid = () => {
        if (data.isCreateNew) {
            for (const project of projectsData) {
                if (data.projectName === project.id) {
                    return false
                }
            }
        }
        return true;
    }

    const getRepositoryName = () => {
        if (data.isCreateNew) {
            return <TextField
                required
                fullWidth
                margin="dense"
                id="repositoryName"
                label="Repository Name"
                type="text"
                value={data.repositoryBranch}
                onChange={handleRepositoryNameChange}
                variant="outlined"
            />;
        }
        return ""
    }

    const getRepositoryBranch = () => {
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

    const getProjectName = () => {
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

    const getExistingProjects = () => {
        console.log("existingPrj : ", projectsData)
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
                {/*{*/}
                {/*    !projectsData && projectsData.map((listProjectsResponse: ListProjectsResponse) =>*/}
                {/*        (*/}
                {/*            <MenuItem key={listProjectsResponse.id} value={listProjectsResponse.id}>*/}
                {/*                {listProjectsResponse.displayName}*/}
                {/*            </MenuItem>*/}
                {/*        )*/}
                {/*    )*/}
                {/*}*/}
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </TextField>;
        }
        return ""
    }

    const prepareCreateProjectRequest = () => {
        const user: User = {
            email: authData.email, name: authData.name
        }
        const repository: Repository = {branch: data.repositoryBranch || 'main', name: data.repositoryName, tag: ""}
        const yaml: CompageYaml = {edges: undefined, nodes: undefined, version: ""}
        const displayName = data.projectName;
        const metadata = data.metadata;
        return JSON.parse("{\n" +
            "    \"user\": {\n" +
            "        \"name\": \"mahendraintelops\",\n" +
            "        \"email\": \"mahendra.b@intelops.dev\"\n" +
            "    },\n" +
            "    \"repository\": {\n" +
            "        \"name\": \"first-project\",\n" +
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
    const listProjectsRequest: ListProjectsRequest = prepareCreateProjectRequest()

    // When clicked, dispatch `createProject`:
    const handleClick = () => dispatch(createProjectAsync(createProjectRequest));

    return (
        <>
            {data.isLoading && <p>Wait I'm Loading repos for you</p>}
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
                    <Button variant="contained"
                            onClick={handleCreate}
                            disabled={data.projectName === "" || !isValid()}>Choose</Button>
                </DialogActions>
            </Dialog>
            {/*<span>{JSON.stringify(data)}</span>*/}
            {/*<span>{JSON.stringify(error)}</span>*/}
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleClick}>
                {projectsStatus === "loading"
                    ? "Creating Project"
                    : "Create Project"}
            </Button>
        </>
    );
}
