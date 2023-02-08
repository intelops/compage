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
    const [openApiYamlFile, setOpenApiYamlFile] = React.useState("");
    const dispatch = useAppDispatch();

    // When clicked, dispatch `uploadYaml`
    const handleUploadYamlClick = () => {
        const currentProject: string = getCurrentProject();
        if (currentProject) {
            const projectAndVersion = currentProject.split("###");
            const uploadYamlRequest: UploadYamlRequest = {
                projectId: projectAndVersion[0],
                nodeId: nodeId,
                file: openApiYamlFile
            };
            if (uploadYamlStatus !== 'loading') {
                dispatch(uploadYamlAsync(uploadYamlRequest));
            }
        }
    };

    const handleFileChange = (e) => {
        setOpenApiYamlFile(e.target.files[0]);
    };

    return (
        <>
            <input type="file" onChange={handleFileChange}/>
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleUploadYamlClick}>
                {uploadYamlStatus === "loading"
                    ? "Uploading file"
                    : "Upload file"}
            </Button>
        </>
    );
};
