import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {Alert, Snackbar, Stack} from "@mui/material";
import {setCurrentRepoDetails} from "../utils/service";
import {commitChanges, createRepo, listRepos, pullChanges} from "../backend/rest-service";
import {GithubRepo, GithubRepoContent} from "../backend/models";
import {useAppSelector} from "../hooks/redux-hooks";

export const Sample = () => {
    const authDetails = useAppSelector(state => state.authDetails);

    const [operationState, setOperationState] = useState({
        severity: "",
        message: "",
        operation: "",
        isOpen: false
    })
    if (!authDetails.user.login) {
        return <Navigate to="/login"/>;
    }

    function handleClose() {
        setOperationState({...operationState, isOpen: false, message: "", severity: "", operation: ""})
    }

    const isRepoNameExists = (newRepoName: string, githubRepos: GithubRepo[]) => {
        for (const githubRepo of githubRepos) {
            if (newRepoName === githubRepo.name) {
                return true
            }
        }
        return false
    }

    const handleResponse = (repoName: string, githubRepoContent: GithubRepoContent) => {
        const currentRepoDetails = {
            repoName: repoName,
            details: githubRepoContent
        }
        setCurrentRepoDetails(JSON.stringify(currentRepoDetails))
    }

    return (
        <React.Fragment>
            <Container>
                <Stack spacing={3} style={{padding: "10px"}}>
                    <Snackbar open={operationState.isOpen} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose}
                               severity={operationState.severity === "success" ? "success" : operationState.severity === "error" ? "error" : operationState.severity === "info" ? "info" : "warning"}
                               sx={{width: '100%'}}>
                            {operationState.severity}
                            {operationState.message}
                        </Alert>
                    </Snackbar>
                    <Button variant="contained" onClick={
                        () => {
                            listRepos(authDetails.user.login)
                                .then((response: Response) => {
                                    if (!response.ok) {
                                        setOperationState({
                                            ...operationState,
                                            message: " : Received Non-200 response : " + response.status,
                                            severity: 'error',
                                            operation: "listRepos",
                                            isOpen: true
                                        })
                                    } else return response.json();
                                })
                                .then(data => {
                                    if (data) {
                                        if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                                            setOperationState({
                                                ...operationState,
                                                message: " : Received response : " + data,
                                                severity: 'error',
                                                operation: "listRepos",
                                                isOpen: true
                                            })
                                        } else {
                                            const newRepoName = "Sample1";
                                            if (!isRepoNameExists(newRepoName, data)) {
                                                // check for repo existence
                                                createRepo(authDetails.user.login, newRepoName, "Sample repo description")
                                                    .then((response: Response) => {
                                                        if (!response.ok) {
                                                            setOperationState({
                                                                ...operationState,
                                                                message: " : Received Non-200 response : " + response.status,
                                                                severity: 'error',
                                                                operation: "createRepo",
                                                                isOpen: true
                                                            })
                                                        } else return response.json();
                                                    })
                                                    .then(data => {
                                                        if (data) {
                                                            if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                                                                setOperationState({
                                                                    ...operationState,
                                                                    message: " : Received response : " + data,
                                                                    severity: 'error',
                                                                    operation: "createRepo",
                                                                    isOpen: true
                                                                })
                                                            } else {
                                                                setOperationState({
                                                                    ...operationState,
                                                                    message: " : Received response : " + data,
                                                                    severity: 'success',
                                                                    operation: "createRepo",
                                                                    isOpen: true
                                                                })
                                                                setCurrentRepoDetails(newRepoName)
                                                            }
                                                        }
                                                    })
                                                    .catch(error => {
                                                        setOperationState({
                                                            ...operationState,
                                                            message: " : Received error : " + error,
                                                            severity: 'error',
                                                            operation: "createRepo",
                                                            isOpen: true
                                                        })
                                                    });
                                            } else {
                                                setOperationState({
                                                    ...operationState,
                                                    message: " : Repo [" + newRepoName + "] name exists! - Please choose different name for the repo.",
                                                    severity: 'error',
                                                    operation: "createRepo",
                                                    isOpen: true
                                                })
                                            }
                                        }
                                    }
                                })
                                .catch(error => {
                                    setOperationState({
                                        ...operationState,
                                        message: " : Received error : " + error,
                                        severity: 'error',
                                        operation: "listRepos",
                                        isOpen: true
                                    })
                                });
                        }
                    }>
                        Create a Repo
                    </Button>
                    <Button variant="contained" onClick={
                        () => {
                            commitChanges(authDetails.user.login, authDetails.user.email, "Sample message")
                                .then((response: Response) => {
                                    if (!response.ok) {
                                        setOperationState({
                                            ...operationState,
                                            message: " : Received Non-200 response : " + JSON.stringify(response),
                                            severity: 'error',
                                            operation: "commitChanges",
                                            isOpen: true
                                        })
                                    } else return response.json();
                                })
                                .then(data => {
                                    if (data) {
                                        if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                                            setOperationState({
                                                ...operationState,
                                                message: " : Received response : " + data,
                                                severity: 'error',
                                                operation: "commitChanges",
                                                isOpen: true
                                            })
                                        } else {
                                            setOperationState({
                                                ...operationState,
                                                message: " : Received response : " + data,
                                                severity: 'success',
                                                operation: "commitChanges",
                                                isOpen: true
                                            })
                                        }
                                    }
                                })
                                .catch(error => {
                                    setOperationState({
                                        ...operationState,
                                        message: " : Received error : " + error,
                                        severity: 'error',
                                        operation: "commitChanges",
                                        isOpen: true
                                    })
                                });
                        }
                    }>
                        Commit changes
                    </Button>
                    <Button variant="contained" onClick={
                        () => {
                            const repoName = "Sample1"
                            pullChanges(authDetails.user.login, repoName)
                                .then((response: Response) => {
                                    if (!response.ok) {
                                        setOperationState({
                                            ...operationState,
                                            message: " : Received Non-200 response : " + response.status,
                                            severity: 'error',
                                            operation: "pullChanges",
                                            isOpen: true
                                        })
                                    } else return response.json();
                                })
                                .then(data => {
                                    if (data) {
                                        if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                                            setOperationState({
                                                ...operationState,
                                                message: " : Received response : " + data,
                                                severity: 'error',
                                                operation: "pullChanges",
                                                isOpen: true
                                            })
                                        } else {
                                            setOperationState({
                                                ...operationState,
                                                message: " : Received response : " + JSON.stringify(data),
                                                severity: 'success',
                                                operation: "pullChanges",
                                                isOpen: true
                                            })
                                            handleResponse(repoName, data)
                                        }
                                    }
                                })
                                .catch(error => {
                                    setOperationState({
                                        ...operationState,
                                        message: " : Received error : " + error,
                                        severity: 'error',
                                        operation: "commitChanges",
                                        isOpen: true
                                    })
                                });
                        }
                    }>
                        Pull changes
                    </Button>
                </Stack>
            </Container>
        </React.Fragment>
    );
}
