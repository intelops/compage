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

// create project models
export interface CreateProjectRequest extends ProjectDTO {
}

// This type describes the error object structure:
export type CreateProjectError = {
    message: string;
};

// listProjects models (the structure matches as of now with CreateProjectRequest but have kept it
// separate for future customizations)
export interface ListProjectsRequest {
    email: string;
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

// This type describes the error object structure:
export interface GetProjectError {
    message: string;
}

// updateProject models (the structure matches as of now with UpdateProjectRequest but have kept it
// separate for future customizations)
export interface UpdateProjectRequest extends ProjectDTO {
}

// This type describes the error object structure:
export type UpdateProjectError = {
    message: string;
};


// deleteProject models (the structure matches as of now with DeleteProjectRequest but have kept it
// separate for future customizations)
export interface DeleteProjectRequest {
    id: string;
    email: string;
}

// This type describes the error object structure:
export type DeleteProjectError = {
    message: string;
};