import {CompageJson, Repository} from "../routes/models";

// entities
export interface ProjectEntity {
    id: string;
    displayName: string;
    version: string;
    ownerEmail: string;
    json: CompageJson;
    repository: Repository;
    metadata?: Map<string, string>;
}

// requests
export interface CreateProjectRequest {

}

export interface DeleteProjectRequest {

}

export interface UpdateProjectRequest {

}

export interface ListProjectsRequest {

}

// responses
interface CreateProjectResponse {
    project: ProjectEntity;
}

interface DeleteProjectResponse {
}

interface UpdateProjectResponse {
}

export const getCreateProjectResponse = (projectEntity: ProjectEntity) => {
    const createProjectResponse: CreateProjectResponse = {
        project: projectEntity,
    };
    return createProjectResponse;
};

export const getListProjectsResponse = (projectEntities: ProjectEntity[]) => {
    const listProjectsResponse: ListProjectsResponse = {
        projects: projectEntities
    };
    return listProjectsResponse;
};

interface ListProjectsResponse {
    projects: ProjectEntity[];
}

// errors
interface CreateProjectError {
    message: string;
}

interface DeleteProjectError {
    message: string;
}

interface UpdateProjectError {
    message: string;
}

interface ListProjectsError {
    message: string;
}

export const getCreateProjectError = (message: string) => {
    const createProjectError: CreateProjectError = {
        message,
    };
    return createProjectError;
};

export const getUpdateProjectError = (message: string) => {
    const updateProjectError: UpdateProjectError = {
        message,
    };
    return updateProjectError;
};

export const getDeleteProjectError = (message: string) => {
    const deleteProjectError: DeleteProjectError = {
        message,
    };
    return deleteProjectError;
};

export const getListProjectsError = (message: string) => {
    const listProjectsError: ListProjectsError = {
        message,
    };
    return listProjectsError;
};