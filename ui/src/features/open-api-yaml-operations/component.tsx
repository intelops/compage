import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectUploadYamlStatus} from './slice';
import Button from "@mui/material/Button";
import {uploadYamlAsync} from "./async-apis/uploadYaml";
import {getCurrentProject, getCurrentState} from "../../utils/localstorage-client";
import {selectGetProjectData, selectUpdateProjectData} from "../projects/slice";
import {removeUnwantedKeys} from "../../components/diagram-maker/helper/helper";
import * as _ from "lodash";

export const UploadYaml = () => {
    const uploadYamlStatus = useAppSelector(selectUploadYamlStatus);
    const getProjectData = useAppSelector(selectGetProjectData);
    const updateProjectData = useAppSelector(selectUpdateProjectData);

    const dispatch = useAppDispatch();

    // When clicked, dispatch `uploadYaml`
    const handleUploadYamlClick = () => {
        const currentProject: string = getCurrentProject();
        if (currentProject) {
            const projectAndVersion = currentProject.split("###");
            const uploadYamlRequest = {
                projectId: projectAndVersion[0]
            };
            if (uploadYamlStatus !== 'loading') {
                dispatch(uploadYamlAsync(uploadYamlRequest));
            }
        }
    };

    const IsAnyRequiredValueMissingInOneOfNodes = (removeUnwantedKeysGetCurrentState: any) => {
        // nodes
        for (let key in removeUnwantedKeysGetCurrentState.nodes) {
            const name = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData?.name
            if (!name) {
                return true;
            }
            const serverTypes = removeUnwantedKeysGetCurrentState.nodes[key]?.consumerData?.serverTypes
            if (!serverTypes || serverTypes === "" || serverTypes === "[]") {
                return true;
            }
        }
        // edges
        for (let key in removeUnwantedKeysGetCurrentState.edges) {
            const name = removeUnwantedKeysGetCurrentState.edges[key]?.consumerData?.name
            if (!name) {
                return true;
            }
            const clientTypes = removeUnwantedKeysGetCurrentState.edges[key]?.consumerData?.clientTypes
            if (!clientTypes || clientTypes === "" || clientTypes === "[]") {
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
            }} variant="contained" disabled={isDisabled()} onClick={handleUploadYamlClick}>
                {uploadYamlStatus === "loading"
                    ? "Uploading Code"
                    : "Uploade Code"}
            </Button>
        </>
    );
};
