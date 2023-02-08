import {ProjectEntity} from "../projects/model";

// This type describes the response object structure:
export interface UploadYamlResponse {
    project: ProjectEntity;
    message: string;
}

// This type describes the error object structure:
export type UploadYamlError = {
    message: string;
};

// upload code models
export interface UploadYamlRequest {
    projectId: string
    nodeId: string;
    file: any;
}
