export interface UploadYamlResponse {
    projectId: string,
    userName: string,
    message: string,
}

// This type describes the error object structure:
export type UploadYamlError = {
    message: string;
};

// upload code models
export interface UploadYamlRequest {
    projectId: string,
}
