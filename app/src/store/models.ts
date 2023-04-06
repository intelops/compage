import {Repository, User} from '../routes/models';

export interface Resource {
    apiVersion: string;
    kind: string;
    metadata: any;
    spec: any;
}

export interface ResourceList {
    apiVersion: string;
    kind: string;
    metadata: any;
    items: Resource[];
}

export interface ProjectResource {
    apiVersion: string;
    kind: string;
    metadata: ProjectResourceMetadata;
    spec: ProjectResourceSpec;
}

export interface UserResource {
    apiVersion: string;
    kind: string;
    metadata: UserResourceMetadata;
    spec: UserResourceSpec;
}

export interface UserResourceMetadata {
    name: string;
    namespace: string;
}

export interface ProjectResourceMetadata {
    name: string;
    namespace: string;
    labels: {
        userName: string;
    };
}

export interface UserResourceSpec {
    email: string;
    token: string;
}

export interface OldVersion {
    version: string;
    json: string;
}

export interface ProjectResourceSpec {
    oldVersions: OldVersion[];
    id: string;
    displayName: string;
    user: User;
    json: string;
    repository: Repository;
    metadata: string;
    version: string;
}

export interface ProjectResourceList {
    apiVersion: string;
    kind: string;
    metadata: string;
    items: ProjectResource[];
}

export interface UserResourceList {
    apiVersion: string;
    kind: string;
    metadata: string;
    items: UserResource[];
}

// user
export const USER_GROUP = 'compage.intelops.github.com';
export const USER_VERSION = 'v1alpha1';
export const USER_PLURAL = 'users';
export const USER_KIND = 'User';

// project
export const PROJECT_GROUP = 'compage.intelops.github.com';
export const PROJECT_VERSION = 'v1alpha1';
export const PROJECT_PLURAL = 'projects';
export const PROJECT_KIND = 'Project';
