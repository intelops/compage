// This type describes the response object structure:
export interface UploadYamlResponse {
    nodeId: string;
    projectId: string;
    content: string;
    message: string;
}

// This type describes the error object structure:
export type UploadYamlError = {
    message: string;
};

// upload code models
export interface UploadYamlRequest {
    nodeId: string;
    projectId: string;
    file: any;
}
