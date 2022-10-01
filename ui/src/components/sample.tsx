import React, {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import {Alert, Snackbar, Stack} from "@mui/material";
import {getRepoName} from "../utils/service";
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
    const commitChange = (message: string): Promise<Response> => {
        const requestBody = {
            message: message || "updated config.json",
            committer: {
                name: state.user.login,
                email: state.user.email || "mahendra.b@intelops.dev"
            },
            content: getBase64EncodedStringForConfig(),
            repo_name: getRepoName()
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
            name: repoName, description: repoDescription, user: state.user.login
        };
        const proxy_url_create_repo = state.proxy_url_create_repo;

        // Use code parameter and other parameters to make POST request to proxy_server
        return fetch(proxy_url_create_repo, {
            method: "POST",
            body: JSON.stringify(requestBody)
        });
    }

    function handleClose() {
        setOperationState({...operationState, isOpen: false, message: "", severity: "", operation: ""})
    }

    return (
        <React.Fragment>
            <Container>
                <Stack spacing={3} style={{padding: "10px"}}>
                    <Snackbar open={operationState.isOpen} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose}
                               severity={operationState.severity == "success" ? "success" : operationState.severity == "error" ? "error" : operationState.severity == "info" ? "info" : "warning"}
                               sx={{width: '100%'}}>
                            {operationState.severity}
                            {operationState.message}
                        </Alert>
                    </Snackbar>
                    <Button variant="contained" onClick={
                        () => {
                            createRepo("Sample1", "Sample repo description")
                                .then((response: Response) => {
                                    if (!response.ok) {
                                        setOperationState({
                                            ...operationState,
                                            message: "-Received Non-200 response : " + response.status,
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
                                                message: "-Received response : " + data,
                                                severity: 'error',
                                                operation: "createRepo",
                                                isOpen: true
                                            })
                                        } else {
                                            setOperationState({
                                                ...operationState,
                                                message: "-Received response : " + data,
                                                severity: 'success',
                                                operation: "createRepo",
                                                isOpen: true
                                            })
                                        }
                                    }
                                })
                                .catch(error => {
                                    setOperationState({
                                        ...operationState,
                                        message: "-Received error : " + error,
                                        severity: 'error',
                                        operation: "createRepo",
                                        isOpen: true
                                    })
                                    console.log(error)
                                });
                        }
                    }>
                        Create a Repo
                    </Button>
                    <Button variant="contained" onClick={
                        () => {
                            commitChange("")
                                .then((response: Response) => {
                                    if (!response.ok) {
                                        setOperationState({
                                            ...operationState,
                                            message: "-Received Non-200 response : " + response.status,
                                            severity: 'error',
                                            operation: "commitChange",
                                            isOpen: true
                                        })
                                    } else return response.json();
                                })
                                .then(data => {
                                    if (data) {
                                        if (JSON.stringify(data).toLowerCase().includes("Bad Credentials".toLowerCase())) {
                                            setOperationState({
                                                ...operationState,
                                                message: "-Received response : " + data,
                                                severity: 'error',
                                                operation: "commitChange",
                                                isOpen: true
                                            })
                                        } else {
                                            setOperationState({
                                                ...operationState,
                                                message: "-Received response : " + data,
                                                severity: 'success',
                                                operation: "commitChange",
                                                isOpen: true
                                            })
                                        }
                                    }
                                })
                                .catch(error => {
                                    setOperationState({
                                        ...operationState,
                                        message: "-Received error : " + error,
                                        severity: 'error',
                                        operation: "commitChange",
                                        isOpen: true
                                    })
                                });
                        }
                    }>
                        Commit changes
                    </Button>
                </Stack>
            </Container>
        </React.Fragment>
    );
}
