import {CompageJson} from "../../components/diagram-maker/models";

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
    id?: string,
    displayName: string,
    version: string,
    user: User,
    yaml: CompageJson,
    repository: Repository,
    metadata?: Map<string, string>
}

export interface Repository {
    name: string,
    tag: string,
    branch: string
}

export interface User {
    name: string,
    email: string
}

// listProjects models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface ListProjectsResponse {
    id: string,
    displayName: string,
    version: string,
    user: User,
    yaml: CompageJson,
    repository: Repository,
    metadata: Map<string, string>
}

export interface ListProjectsRequest {
}

// This type describes the error object structure:
export type ListProjectsError = {
    message: string;
};

// getProject models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface GetProjectResponse {
    id: string,
    displayName: string,
    version: string,
    user: User,
    yaml: CompageJson,
    repository: Repository,
    metadata: Map<string, string>
}

export interface GetProjectRequest {
    id: string,
}

// This type describes the error object structure:
export type GetProjectError = {
    message: string;
};