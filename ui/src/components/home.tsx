import React from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentRepoDetails,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../utils/service";
import {useAppSelector} from "../hooks/redux-hooks";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Button from "@mui/material/Button";
import {generateProject} from "../backend/rest-service";

export const Home = () => {
    const authentication = useAppSelector(state => state.authentication);
    if (!authentication.user.login) {
        return <Navigate to="/login"/>;
    }
    if (getCurrentRepoDetails() === null || getCurrentRepoDetails() === undefined) {
        // choose from existing or create a new project
        // return <Navigate to="/repo"/>;
    } else {
        // open existing project
        // check for config if its present in the localstorage
        // if not pull state from github
    }

    let currentConfig = getCurrentConfig();
    let diagramMakerData
    if (currentConfig && currentConfig !== "{}") {
        diagramMakerData = JSON.parse(currentConfig);
    } else {
        diagramMakerData = getData(1050, 550);
    }

    const genProject = () => {
        console.log("generated project")
        generateProject("mahendraintelops", "samplerepo1", "device-backend", "sss").then(generatedProject => {
            debugger
            if (generatedProject) {
                if (JSON.stringify(generatedProject).toLowerCase().includes("Bad Credentials".toLowerCase())) {
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
                    console.log(generatedProject)
                }
            }
        }).catch(error => {
            debugger
            console.log(error)
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

    return (
        <React.Fragment>
            <DiagramMakerContainer initialData={diagramMakerData} darkTheme={false}/>
            <Button variant="contained" onClick={() => {
                removeCurrentConfig()
                removeCurrentState()
                removeModifiedState()
                setReset(true)
                // after resetting, needs to manually reload so, avoiding manual step here.
                window.location.reload();
            }}>Reset state</Button>
            <Button variant="outlined" onClick={() => {
                genProject()
            }}>Generate Project</Button>
        </React.Fragment>
    );
}
