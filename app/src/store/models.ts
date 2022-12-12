import {Repository, User} from "../routes/models";

export interface UserResource {
    email: string,
    token: string,
    name: string
}

export interface ProjectResource {
    id: string,
    name: string,
    user: User,
    yaml: string,
    repository: Repository,
    metadata: string,
    version: string,
}