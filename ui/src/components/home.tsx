import React from "react";
import {Navigate} from "react-router-dom";
import {getData} from "../data/BoundaryCircular/data";
import {
    getCurrentConfig,
    getCurrentRepositoryDetails,
    removeCurrentConfig,
    removeCurrentState,
    removeModifiedState,
    setReset
} from "../utils/service";
import {useAppSelector} from "../hooks/redux-hooks";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";
import Button from "@mui/material/Button";
import {createProject} from "../backend/rest-service";
import GenerateProject from "./generate-project";

export const Home = () => {
    const authentication = useAppSelector(state => state.authentication);
    if (!authentication.user.login) {
        return <Navigate to="/login"/>;
    }
    if (getCurrentRepositoryDetails() === null || getCurrentRepositoryDetails() === undefined) {
        // choose from existing or create a new project
        // return <Navigate to="/repository"/>;
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
        // checkToken("mahendraintelops").then(response => {
        //     console.log(response)
        // }).catch(error => {
        //     console.log(error)
        // })
        createProject("mahendraintelops", "samplerepo1", "device-backend", "{\n    \"edges\": {\n      \"edge-62\": {\n        \"dest\": \"node-dc\",\n        \"id\": \"edge-62\",\n        \"src\": \"node-1d\"\n      },\n      \"edge-40\": {\n        \"dest\": \"node-ee\",\n        \"id\": \"edge-40\",\n        \"src\": \"node-dc\"\n      },\n      \"edge-84\": {\n        \"dest\": \"node-ee\",\n        \"id\": \"edge-84\",\n        \"src\": \"node-a6\"\n      },\n      \"edge-74\": {\n        \"dest\": \"node-1d\",\n        \"id\": \"edge-74\",\n        \"src\": \"node-a6\"\n      }\n    },\n    \"nodes\": {\n      \"node-1d\": {\n        \"id\": \"node-1d\",\n        \"typeId\": \"node-type-circle\",\n        \"consumerData\": {\n          \"nodeType\": \"circle\",\n          \"type\": \"intermediate-1\",\n          \"name\": \"service-b\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"Java\",\n          \"url\": \"\"\n        }\n      },\n      \"node-dc\": {\n        \"id\": \"node-dc\",\n        \"typeId\": \"node-type-rectangle\",\n        \"consumerData\": {\n          \"nodeType\": \"rectangle\",\n          \"type\": \"backend\",\n          \"name\": \"service-d\",\n          \"isServer\": true,\n          \"isClient\": false,\n          \"language\": \"Golang\",\n          \"url\": \"\"\n        }\n      },\n      \"node-ee\": {\n        \"id\": \"node-ee\",\n        \"typeId\": \"node-type-circle\",\n        \"consumerData\": {\n          \"nodeType\": \"circle\",\n          \"type\": \"intermediate-2\",\n          \"name\": \"service-c\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"NodeJs\",\n          \"url\": \"\"\n        }\n      },\n      \"node-a6\": {\n        \"id\": \"node-a6\",\n        \"typeId\": \"node-type-start-top-bottom\",\n        \"consumerData\": {\n          \"type\": \"frontend\",\n          \"name\": \"service-a\",\n          \"isServer\": true,\n          \"isClient\": true,\n          \"language\": \"NodeJs\",\n          \"url\": \"\"\n        }\n      }\n    }\n  }").then(generatedProject => {
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
            {/*<Button variant="outlined" onClick={() => {*/}
            {/*    genProject()*/}
            {/*}}>Generate Project</Button>*/}
            <GenerateProject></GenerateProject>
        </React.Fragment>
    );
}
