export interface GenerateProjectResponse {
    projectId: string,
    userName: string,
    message: string,
    error: string,
}

// This type describes the error object structure:
export type GenerateProjectError = {
    message: string;
};

// generate project models
export interface GenerateProjectRequest {
    projectId: string,
}
