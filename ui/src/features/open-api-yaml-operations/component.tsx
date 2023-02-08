import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectUploadYamlData, selectUploadYamlStatus} from './slice';
import Button from "@mui/material/Button";
import {uploadYamlAsync} from "./async-apis/uploadYaml";
import {getCurrentProject} from "../../utils/localstorage-client";
import {UploadYamlRequest} from "./model";

interface ArgTypes {
    nodeId: string;
}

export const UploadYaml = ({nodeId}: ArgTypes) => {
    const uploadYamlStatus = useAppSelector(selectUploadYamlStatus);
    const uploadYamlData = useAppSelector(selectUploadYamlData);

    const dispatch = useAppDispatch();

    // When clicked, dispatch `uploadYaml`
    const handleUploadYamlClick = () => {
        const currentProject: string = getCurrentProject();
        if (currentProject) {
            const projectAndVersion = currentProject.split("###");
            const uploadYamlRequest: UploadYamlRequest = {
                projectId: projectAndVersion[0],
                nodeId: nodeId
            };
            if (uploadYamlStatus !== 'loading') {
                dispatch(uploadYamlAsync(uploadYamlRequest));
            }
        }
    };

    return (
        <>
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleUploadYamlClick}>
                {uploadYamlStatus === "loading"
                    ? "Uploading Code"
                    : "Upload Code"}
            </Button>
        </>
    );
};
