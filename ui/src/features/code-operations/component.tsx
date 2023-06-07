import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectGenerateCodeStatus} from './slice';
import Button from "@mui/material/Button";
import {generateCodeAsync} from "./async-apis/generateCode";
import {getCurrentProjectDetails, getCurrentState} from "../../utils/localstorage-client";
import {selectGetProjectData, selectUpdateProjectData} from "../projects-operations/slice";
import {removeUnwantedKeys} from "../../components/diagram-maker/helper/helper";
import * as _ from "lodash";
import {GrpcServerConfig, RestClientConfig, RestServerConfig} from "../../components/diagram-maker/models";
import {isCompageTemplate} from "../../components/diagram-maker/node-properties/utils";

export const GenerateCode = () => {
    const generateCodeStatus = useAppSelector(selectGenerateCodeStatus);
    const getProjectData = useAppSelector(selectGetProjectData);
    const updateProjectData = useAppSelector(selectUpdateProjectData);

    const dispatch = useAppDispatch();

    // When clicked, dispatch `generateCode`
    const handleGenerateCodeClick = () => {
        const currentProjectDetails: string = getCurrentProjectDetails();
        if (currentProjectDetails) {
            const userNameAndProjectAndVersion = currentProjectDetails.split("###");
            const generateCodeRequest = {
                projectId: userNameAndProjectAndVersion[1]
            };
            if (generateCodeStatus !== 'loading') {
                dispatch(generateCodeAsync(generateCodeRequest));
            }
        }
    };

    const isValidRestConfig = (removeUnwantedKeysGetCurrentState: any, key: string) => {
        const restServerConfig: RestServerConfig = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData?.restServerConfig;
        if (!restServerConfig || Object.keys(restServerConfig).length < 1) {
            return true;
        }
        // in case of compage template, resources should not be empty.
        return isCompageTemplate(restServerConfig.template) && restServerConfig.resources.length < 1;
    };

    const isValidGrpcConfig = (removeUnwantedKeysGetCurrentState: any, key: string) => {
        const grpcServerConfig: GrpcServerConfig = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData?.grpcServerConfig;
        if (!grpcServerConfig || Object.keys(grpcServerConfig).length < 1) {
            return true;
        }
        // in case of compage template, resources should not be empty.
        return isCompageTemplate(grpcServerConfig.template) && grpcServerConfig.resources.length < 1;
    };

    const IsAnyRequiredValueMissingInOneOfNodes = (removeUnwantedKeysGetCurrentState: any) => {
        // nodes
        // tslint:disable-next-line: forin
        for (const key in removeUnwantedKeysGetCurrentState?.nodes) {
            const name = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData?.name;
            if (!name) {
                return true;
            }
            if (isValidRestConfig(removeUnwantedKeysGetCurrentState, key)
                || isValidGrpcConfig(removeUnwantedKeysGetCurrentState, key)) {
                return false;
            }
        }
        // edges
        // tslint:disable-next-line: forin
        for (const key in removeUnwantedKeysGetCurrentState?.edges) {
            const name = removeUnwantedKeysGetCurrentState.edges[key]?.consumerData?.name;
            if (!name) {
                return true;
            }
            // rest, similar checks need to be added below for grpc and ws.
            const restClientConfig: RestClientConfig = removeUnwantedKeysGetCurrentState.edges[key]?.consumerData?.restClientConfig;
            if (!restClientConfig || Object.keys(restClientConfig).length < 1) {
                return true;
            }
        }
        return false;
    };

    const isDisabled = () => {
        const removeUnwantedKeysGetCurrentState = removeUnwantedKeys(getCurrentState());
        // check if the updated project data has been modified.
        if (IsAnyRequiredValueMissingInOneOfNodes(removeUnwantedKeysGetCurrentState)) {
            // disable as required values are missing
            return true;
        }

        if (updateProjectData?.project?.json) {
            const removeUnwantedKeyUpdateProject = removeUnwantedKeys(JSON.stringify(updateProjectData.project.json));
            if (_.isEqual(removeUnwantedKeyUpdateProject, removeUnwantedKeysGetCurrentState) && Object.keys(updateProjectData.project.json?.nodes).length !== 0) {
                return false;
            }
        }
        // check if the get project data is different.
        if (getProjectData?.json) {
            const removeUnwantedKeyGetProject = removeUnwantedKeys(JSON.stringify(getProjectData?.json));
            if (_.isEqual(removeUnwantedKeyGetProject, removeUnwantedKeysGetCurrentState)) {
                return false;
            }
        }
        return true;
    };

    return (
        <>
            <Button style={{
                width: "200px"
            }} variant="contained" disabled={isDisabled() || generateCodeStatus === "loading"}
                    onClick={handleGenerateCodeClick}>
                {generateCodeStatus === "loading"
                    ? "Generating Code"
                    : "Generate Code"}
            </Button>
        </>
    );
};
