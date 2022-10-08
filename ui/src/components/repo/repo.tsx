import React, {ChangeEvent, useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {createRepo, listRepos, pullChanges} from "../../backend/rest-service";
import {GithubRepo} from "../../backend/models";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import {Checkbox, FormControlLabel, Stack} from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {setCurrentRepoDetails} from "../../utils/service";
import {useAppSelector} from "../../hooks/redux-hooks";

export const Repo = () => {
    const navigate = useNavigate()
    const authDetails = useAppSelector(state => state.authDetails);
    const [data, setData] = useState({
        errorMessage: "",
        isLoading: true,
        isOpen: false,
        repos: [],
        currentRepo: "",
        isCreateNew: false,
        description: ""
    });

    const getRepos = (items: GithubRepo[]) => {
        console.log("items : ", items)
        return items;
    }

    const handleClose = () => {
        setData({...data, isOpen: false})
        navigate('/home');
    }

    useEffect(() => {
        listRepos(authDetails.user.login)
            .then(items => {
                setData({...data, isOpen: true, isLoading: false, repos: getRepos(items)})
            })
    }, [setData])
    if (!authDetails.user.login) {
        return <Navigate to="/login"/>;
    }

    const handleCreate = () => {
        // give a call to create repo if it's new
        if (data.isCreateNew) {
            createRepo(authDetails.user.login, data.currentRepo, data.description)
                .then(createdItem => {
                    if (createdItem) {
                        if (JSON.stringify(createdItem).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                            //TODO
                            // setOperationState({
                            //     ...operationState,
                            //     message: " : Received response : " + createdItem,
                            //     severity: 'error',
                            //     operation: "createRepo",
                            //     isOpen: true
                            // })
                        } else {
                            //TODO
                            // setOperationState({
                            //     ...operationState,
                            //     message: " : Received response : " + createdItem,
                            //     severity: 'success',
                            //     operation: "createRepo",
                            //     isOpen: true
                            // })
                            const currentRepoDetails = {
                                repoName: data.currentRepo,
                            }
                            setCurrentRepoDetails(JSON.stringify(currentRepoDetails))
                        }
                    }
                })
                .catch(error => {
                    //TODO
                    // setOperationState({
                    //     ...operationState,
                    //     message: " : Received error : " + error,
                    //     severity: 'error',
                    //     operation: "createRepo",
                    //     isOpen: true
                    // })
                });
        }
        // set the current repo retails post response from server
        // give call to pull the latest contents
        pullChanges(authDetails.user.login, data.currentRepo)
            .then(pulledItem => {
                if (pulledItem) {
                    if (JSON.stringify(pulledItem).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                        //TODO
                        // setOperationState({
                        //     ...operationState,
                        //     message: " : Received response : " + createdItem,
                        //     severity: 'error',
                        //     operation: "createRepo",
                        //     isOpen: true
                        // })
                    } else {
                        //TODO
                        // setOperationState({
                        //     ...operationState,
                        //     message: " : Received response : " + createdItem,
                        //     severity: 'success',
                        //     operation: "createRepo",
                        //     isOpen: true
                        // })
                        const currentRepoDetails = {
                            repoName: data.currentRepo,
                        }
                        setCurrentRepoDetails(JSON.stringify(currentRepoDetails))
                    }
                }
            }).catch(error => {
            //TODO
            // setOperationState({
            //     ...operationState,
            //     message: " : Received error : " + error,
            //     severity: 'error',
            //     operation: "createRepo",
            //     isOpen: true
            // })
        });
        const currentRepoDetails = {
            repoName: data.currentRepo,
            //TODO
            details: "githubRepoContent"
        }
        setCurrentRepoDetails(JSON.stringify(currentRepoDetails))
        setData({...data, isOpen: false})
        navigate('/home');
    }

    const handleExistingReposChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            currentRepo: event.target.value
        });
    };

    const handleNewRepoChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        setData({
            ...data,
            currentRepo: event.target.value
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
            for (const repo of data.repos) {
                if (data.currentRepo === repo.name) {
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
                value={data.currentRepo}
                onChange={handleNewRepoChange}
                variant="outlined"
            />;
        }
        return "";
    }

    const getExistingRepos = () => {
        if (!data.isCreateNew) {
            return <TextField
                required
                fullWidth
                select
                disabled={data.isCreateNew}
                margin="dense"
                id="repo"
                label="Existing Repos"
                type="text"
                value={data.currentRepo}
                onChange={handleExistingReposChange}
                variant="outlined">
                {data.repos.map((repo: GithubRepo) => (
                    <MenuItem key={repo.name} value={repo.name}>
                        {repo.full_name}
                    </MenuItem>
                ))}
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
                    {getExistingRepos()}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleCreate}
                        disabled={data.currentRepo === "" || !isValid()}>Choose</Button>
            </DialogActions>
        </Dialog>


    </>
}
