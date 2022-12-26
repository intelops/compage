import {CompageYaml, Repository, User} from "../../models/redux-models";

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
    yaml: CompageYaml,
    repository: Repository,
    metadata?: Map<string, string>
}
