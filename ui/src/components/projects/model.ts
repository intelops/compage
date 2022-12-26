export interface CreateProjectResponse {
    projectId: string,
    userName: string,
    message: string,
    error: string,
}

// This type describes the error object structure:
export type CreateProjectError = {
    message: string;
};

// create project models
export interface CreateProjectRequest {
    projectId: string,
}
