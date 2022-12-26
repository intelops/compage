import React from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectProjectsStatus} from './slice';
import Button from "@mui/material/Button";
import {createProjectAsync} from "./async-apis/createProject";
import {CreateProjectRequest} from "./model";
import {CompageYaml, Repository, User} from "../../models/redux-models";
import {selectAuthData} from "../auth/slice";

export const CreateProject = () => {
    // TODO below values can be used if we want to get data from api
    // const data = useAppSelector(selectData);
    // const error = useAppSelector(selectError);
    const projectsStatus = useAppSelector(selectProjectsStatus);
    const authData = useAppSelector(selectAuthData);

    const dispatch = useAppDispatch();
    const prepareCreateProjectRequest = () => {
        const user: User = {
            email: authData.email, name: authData.name
        }
        const repository: Repository = {branch: "", name: "", tag: ""}
        const yaml: CompageYaml = {edges: undefined, nodes: undefined, version: ""}
        const metadata: Map<string, string> = new Map<string, string>()

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

    // When clicked, dispatch `createProject`:
    const handleClick = () => dispatch(createProjectAsync(createProjectRequest));

    return (
        <>
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
