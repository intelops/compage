// ProjectDTO is for transferring info about projects from client to server
import {CompageJson} from "../../components/diagram-maker/models";

export interface ProjectDTO {
    id: string;
    displayName?: string;
    version: string;
    json: CompageJson;
    gitPlatformUserName?: string;
    gitPlatformName?: string;
    repositoryName?: string;
    repositoryBranch?: string;
    isRepositoryPublic?: boolean;
    repositoryUrl?: string;
    // TODO temporary made optional.
    metadata?: Map<string, string>;
    ownerEmail: string;
}

export interface CreateProjectResponse extends ProjectDTO {
}

// This type describes the error object structure:
export type CreateProjectError = {
    message: string;
};

// create project models
export interface CreateProjectRequest extends ProjectDTO {
}

// listProjects models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface ListProjectsRequest {
    email: string;
}

export interface ListProjectsResponse {
}

// This type describes the error object structure:
export type ListProjectsError = {
    message: string;
};

// existsProject models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface ExistsProjectRequest {
    id: string;
    email: string;
}

export interface ExistsProjectResponse extends ProjectDTO {
}

// This type describes the error object structure:
export interface ExistsProjectError {
    message: string;
}

// getProject models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface GetProjectRequest {
    id: string;
    email: string;
}

export interface GetProjectResponse extends ProjectDTO {
}

// This type describes the error object structure:
export interface GetProjectError {
    message: string;
}

// updateProject models (the structure matches as of now with UpdateProjectRequest but have kept it
// separate for future customizations)
export interface UpdateProjectRequest extends ProjectDTO {
}

export interface UpdateProjectResponse {
}

// This type describes the error object structure:
export type UpdateProjectError = {
    message: string;
};