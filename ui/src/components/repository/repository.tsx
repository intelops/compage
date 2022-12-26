import React, {ChangeEvent, useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {GithubRepository} from "../../backend/models";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setCurrentRepositoryDetails} from "../../utils/service";
import {useAppSelector} from "../../hooks/redux-hooks";
import {toastr} from 'react-redux-toastr'
import {selectAuthData} from "../auth/slice";

export const Repository = () => {
    const navigate = useNavigate()
    const authData = useAppSelector(selectAuthData);
    const [data, setData] = useState({
        errorMessage: "",
        isLoading: true,
        isOpen: false,
        projects: [],
        currentProject: "",
        isCreateNew: false,
        description: ""
    });

    const getProjects = (items: GithubRepository[]) => {
        console.log("items : ", items)
        return items;
    }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    useEffect(() => {
        // TODO
        // dispatch listProjects
        // setData({...data, isOpen: true, isLoading: false, projects: getProjects(items)})
    }, [setData])

    if (!authData.login) {
        return <Navigate to="/login"/>;
    }

    const handleCreate = () => {
        // give a call to create project if it's new
        if (data.isCreateNew) {
            // TODO
            // authData.login, data.currentProject, data.description
            // use above data to create new project
        }
        // set the current repository retails post response from server
        // give call to pull the latest contents
        const currentRepositoryDetails = {
            repositoryName: data.currentProject,
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
            currentProject: event.target.value
        });
    };

    const handleNewProjectChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            currentProject: event.target.value
        });
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            description: event.target.value
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
            for (const repository of data.projects) {
                if (data.currentProject === repository.name) {
                    return false
                }
            }
        }
        return true;
    }

    const getDescription = () => {
        if (data.isCreateNew) {
            return <TextField
                required
                fullWidth
                margin="dense"
                id="description"
                label="Description"
                type="text"
                value={data.description}
                onChange={handleDescriptionChange}
                variant="outlined"
            />;
        }
        return ""
    }

    const getName = () => {
        if (data.isCreateNew) {
            return <TextField
                required
                fullWidth
                margin="dense"
                id="name"
                label="Name of Repository"
                type="text"
                value={data.currentProject}
                onChange={handleNewProjectChange}
                variant="outlined"
            />;
        }
        return "";
    }

    const getExistingProjects = () => {
        if (!data.isCreateNew) {
            return <TextField
                required
                fullWidth
                select
                disabled={data.isCreateNew}
                margin="dense"
                id="repository"
                label="Existing Projects"
                type="text"
                value={data.currentProject}
                onChange={handleExistingProjectsChange}
                variant="outlined">
                {
                    !data && data.projects.map((githubRepository: GithubRepository) => (
                        <MenuItem key={githubRepository.name} value={githubRepository.name}>
                            {githubRepository.full_name}
                        </MenuItem>
                    ))
                }
            </TextField>;
        }
        return ""
    }

    return <>
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
                    {getName()}
                    {getDescription()}
                    {getExistingProjects()}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={() => toastr.error('The title', 'The message')}
                    type="button">Toastr Success</Button>
                <Button variant="contained"
                        onClick={handleCreate}
                        disabled={data.currentProject === "" || !isValid()}>Choose</Button>
            </DialogActions>
        </Dialog>


    </>
}
