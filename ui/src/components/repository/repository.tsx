import React, {ChangeEvent, useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {createRepository, listRepositories, pullCompageYaml} from "../../backend/rest-service";
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
import {selectData} from "../auth/slice";

export const Repository = () => {
    const navigate = useNavigate()
    const auth = useAppSelector(selectData);
    const [data, setData] = useState({
        errorMessage: "",
        isLoading: true,
        isOpen: false,
        repositories: [],
        currentRepository: "",
        isCreateNew: false,
        description: ""
    });

    const getRepositories = (items: GithubRepository[]) => {
        console.log("items : ", items)
        return items;
    }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    useEffect(() => {
        listRepositories(auth.login)
            .then(items => {
                setData({...data, isOpen: true, isLoading: false, repositories: getRepositories(items)})
            })
    }, [setData])

    if (!auth.login) {
        return <Navigate to="/login"/>;
    }

    const handleCreate = () => {
        // give a call to create repository if it's new
        if (data.isCreateNew) {
            createRepository(auth.login, data.currentRepository, data.description)
                .then(createdItem => {
                    if (createdItem) {
                        if (JSON.stringify(createdItem).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                            //TODO
                            // setOperationState({
                            //     ...operationState,
                            //     message: " : Received response : " + createdItem,
                            //     severity: 'error',
                            //     operation: "createRepository",
                            //     isOpen: true
                            // })
                        } else {
                            //TODO
                            // setOperationState({
                            //     ...operationState,
                            //     message: " : Received response : " + createdItem,
                            //     severity: 'success',
                            //     operation: "createRepository",
                            //     isOpen: true
                            // })
                            const currentRepositoryDetails = {
                                repositoryName: data.currentRepository,
                            }
                            setCurrentRepositoryDetails(JSON.stringify(currentRepositoryDetails))
                        }
                    }
                })
                .catch(error => {
                    //TODO
                    // setOperationState({
                    //     ...operationState,
                    //     message: " : Received error : " + error,
                    //     severity: 'error',
                    //     operation: "createRepository",
                    //     isOpen: true
                    // })
                });
        }
        // set the current repository retails post response from server
        // give call to pull the latest contents
        pullCompageYaml(auth.login, data.currentRepository)
            .then(pulledItem => {
                if (pulledItem) {
                    if (JSON.stringify(pulledItem).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                        //TODO
                        // setOperationState({
                        //     ...operationState,
                        //     message: " : Received response : " + createdItem,
                        //     severity: 'error',
                        //     operation: "createRepository",
                        //     isOpen: true
                        // })
                    } else {
                        //TODO
                        // setOperationState({
                        //     ...operationState,
                        //     message: " : Received response : " + createdItem,
                        //     severity: 'success',
                        //     operation: "createRepository",
                        //     isOpen: true
                        // })
                        const currentRepositoryDetails = {
                            repositoryName: data.currentRepository,
                        }
                        setCurrentRepositoryDetails(JSON.stringify(currentRepositoryDetails))
                    }
                }
            }).catch(error => {
            //TODO
            // setOperationState({
            //     ...operationState,
            //     message: " : Received error : " + error,
            //     severity: 'error',
            //     operation: "createRepository",
            //     isOpen: true
            // })
        });
        const currentRepositoryDetails = {
            repositoryName: data.currentRepository,
            //TODO
            details: "githubRepositoryContent"
        }
        setCurrentRepositoryDetails(JSON.stringify(currentRepositoryDetails))
        setData({...data, isOpen: false})
        navigate('/home');
    }

    const handleExistingRepositoriesChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            currentRepository: event.target.value
        });
    };

    const handleNewRepositoryChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            currentRepository: event.target.value
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
            for (const repository of data.repositories) {
                if (data.currentRepository === repository.name) {
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
                value={data.currentRepository}
                onChange={handleNewRepositoryChange}
                variant="outlined"
            />;
        }
        return "";
    }

    const getExistingRepositories = () => {
        if (!data.isCreateNew) {
            return <TextField
                required
                fullWidth
                select
                disabled={data.isCreateNew}
                margin="dense"
                id="repository"
                label="Existing Repositories"
                type="text"
                value={data.currentRepository}
                onChange={handleExistingRepositoriesChange}
                variant="outlined">
                {
                    !data && data.repositories.map((githubRepository: GithubRepository) => (
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
                    {getExistingRepositories()}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={() => toastr.error('The title', 'The message')}
                    type="button">Toastr Success</Button>
                <Button variant="contained"
                        onClick={handleCreate}
                        disabled={data.currentRepository === "" || !isValid()}>Choose</Button>
            </DialogActions>
        </Dialog>


    </>
}
