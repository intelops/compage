import React, {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {Alert, Snackbar, Stack} from "@mui/material";
import {getCurrentRepoDetails, setCurrentRepoDetails} from "../utils/service";
import {getBase64EncodedStringForConfig} from "./diagram-maker/helper/helper";

export const Sample = () => {
    const {state} = useContext(AuthContext);
    const [operationState, setOperationState] = useState({
        severity: "",
        message: "",
        operation: "",
        isOpen: false
    })
    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }
    const pullChanges = (repoName: string): Promise<Response> => {
        const proxy_url_pull_changes = state.proxy_url_pull_changes + "?userName=" + state.user.login + "&repoName=" + (repoName || getCurrentRepoDetails().repoName);
        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_pull_changes, {
            method: "GET",
        });
    }
    const commitChanges = (message: string): Promise<Response> => {
        const requestBody = {
            message: message || "updated config.json",
            committer: {
                userName: state.user.login,
                email: state.user.email || "mahendra.b@intelops.dev"
            },
            content: getBase64EncodedStringForConfig(),
            sha: getCurrentRepoDetails().details.sha,
            repoName: getCurrentRepoDetails().repoName || "Sample1"
        };
        const proxy_url_commit_changes = state.proxy_url_commit_changes;

        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_commit_changes, {
            method: "PUT",
            body: JSON.stringify(requestBody)
        });
    }
    const createRepo = (repoName: string, repoDescription: string): Promise<Response> => {
        const requestBody = {
            repoName: repoName, description: repoDescription, userName: state.user.login
        };
        const proxy_url_create_repo = state.proxy_url_create_repo;

        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_create_repo, {
            method: "POST",
            body: JSON.stringify(requestBody)
        });
    }
    const listRepos = (): Promise<Response> => {
        const proxy_url_list_repos = state.proxy_url_list_repos;
        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_list_repos, {
            method: "GET",
        });
    }
    const checkToken = (): Promise<Response> => {
        const proxy_url_check_token = state.proxy_url_check_token + "?userName=" + state.user.login;
        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_check_token, {
            method: "GET",
        });
    }

    function handleClose() {
        setOperationState({...operationState, isOpen: false, message: "", severity: "", operation: ""})
    }

    interface GithubRepo {
        name: string,
        private: boolean,
        full_name: string
    }

    const isRepoNameExists = (newRepoName: string, githubRepos: GithubRepo[]) => {
        for (const githubRepo of githubRepos) {
            if (newRepoName === githubRepo.name) {
                return true
            }
        }
        return false
    }

    interface GithubRepoContent {
        name: string,
        path: boolean,
        sha: string,
        content: string,
        type: string
        encoding: string,
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
                            listRepos()
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
                                                createRepo(newRepoName, "Sample repo description")
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
                            commitChanges("")
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
                            pullChanges(repoName)
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
