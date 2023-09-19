import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectUploadYamlData, selectUploadYamlStatus} from './slice';
import Button from "@mui/material/Button";
import {uploadYamlAsync} from "./async-apis/uploadYaml";
import {getCurrentProjectDetails} from "../../utils/localstorageClient";
import {UploadYamlRequest} from "./model";

interface ArgTypes {
    nodeId: string;
}

export const UploadYaml = ({nodeId}: ArgTypes) => {
    const uploadYamlStatus = useAppSelector(selectUploadYamlStatus);
    const uploadYamlData = useAppSelector(selectUploadYamlData);
    console.log("uploadYamlData", uploadYamlData);
    const [openApiYamlFile, setOpenApiYamlFile] = React.useState("");
    const dispatch = useAppDispatch();

    // When clicked, dispatch `uploadYaml`
    const handleUploadYamlClick = () => {
        const currentProjectDetails: string = getCurrentProjectDetails();
        if (currentProjectDetails) {
            const userNameAndProjectAndVersion = currentProjectDetails.split("###");
            const uploadYamlRequest: UploadYamlRequest = {
                projectId: userNameAndProjectAndVersion[1],
                nodeId,
                file: openApiYamlFile,
            };
            if (uploadYamlStatus !== 'loading') {
                dispatch(uploadYamlAsync(uploadYamlRequest));
            }
            setOpenApiYamlFile("");
        }
    };

    const handleFileChange = (e) => {
        setOpenApiYamlFile(e.target.files[0]);
    };

    const isDisabled = () => {
        return !openApiYamlFile || openApiYamlFile.length < 1 || uploadYamlStatus === "loading";
    };

    return (
        <>
            <input type="file" onChange={handleFileChange} accept=".yaml,.yml"/>
            <Button variant="contained" disabled={isDisabled()} onClick={handleUploadYamlClick}>
                {uploadYamlStatus === "loading"
                    ? "Uploading file"
                    : "Upload file"}
            </Button>
        </>
    );
};
