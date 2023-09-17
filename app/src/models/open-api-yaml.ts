export interface UploadYamlRequest {
    nodeId: string;
    projectId: string;
    file: any;
}

// This type describes the response object structure:
export interface UploadYamlResponse {
    nodeId: string;
    projectId: string;
    content: string;
    message: string;
}

// This type describes the error object structure:
export interface UploadYamlError {
    message: string;
}

export const getUploadYamlError = (message: string) => {
    const uploadYamlError: UploadYamlError = {
        message,
    };
    return uploadYamlError;
};

export const getUploadYamlResponse = (projectId: string, nodeId: string, content: string, message: string
) => {
    const uploadYamlResponse: UploadYamlResponse = {
        projectId,
        nodeId,
        content,
        message,
    };
    return uploadYamlResponse;
};
