// entities
// entities
import {CompageJson} from './code';

export interface ProjectEntity {
    id: string;
    display_name: string;
    version: string;
    owner_email: string;
    json: string;
    metadata: string;
    git_platform_user_name: string;
    git_platform_name: string;
    repository_name: string;
    repository_branch: string;
    is_repository_public: boolean;
    repository_url: string;
    old_versions: string[];
    created_at?: string;
    updated_at?: string;
}

export interface OldVersion {
    version: string;
    json: string;
}

export interface ProjectDTO {
    id: string;
    displayName: string;
    version: string;
    json: CompageJson;
    gitPlatformUserName: string;
    gitPlatformName: string;
    repositoryName: string;
    repositoryBranch: string;
    isRepositoryPublic: boolean;
    repositoryUrl: string;
    // TODO temporary made optional.
    metadata?: Map<string, string>;
    ownerEmail: string;
    oldVersions?: OldVersion[];
    createdAt?: string;
    updatedAt?: string;
}

// requests
export interface CreateProjectRequest extends ProjectDTO {

}

export interface DeleteProjectRequest {

}

export interface UpdateProjectRequest extends ProjectDTO {

}

export interface ListProjectsRequest {

}

export const getCreateProjectResponse = (projectEntity: ProjectEntity) => {
    const projectDTO: ProjectDTO = {
        id: projectEntity.id,
        displayName: projectEntity.display_name,
        version: projectEntity.version,
        json: JSON.parse(projectEntity.json),
        ownerEmail: projectEntity.owner_email,
        createdAt: projectEntity.created_at,
        updatedAt: projectEntity.updated_at,
        gitPlatformUserName: projectEntity.git_platform_user_name,
        gitPlatformName: projectEntity.git_platform_name,
        repositoryName: projectEntity.repository_name,
        repositoryBranch: projectEntity.repository_branch,
        isRepositoryPublic: projectEntity.is_repository_public,
        repositoryUrl: projectEntity.repository_url,
    };
    return projectDTO;
};

export const getGetProjectResponse = (projectEntity: ProjectEntity) => {
    const projectDTO: ProjectDTO = {
        id: projectEntity.id,
        displayName: projectEntity.display_name,
        version: projectEntity.version,
        json: JSON.parse(projectEntity.json),
        ownerEmail: projectEntity.owner_email,
        createdAt: projectEntity.created_at,
        updatedAt: projectEntity.updated_at,
        gitPlatformUserName: projectEntity.git_platform_user_name,
        gitPlatformName: projectEntity.git_platform_name,
        repositoryName: projectEntity.repository_name,
        repositoryBranch: projectEntity.repository_branch,
        isRepositoryPublic: projectEntity.is_repository_public,
        repositoryUrl: projectEntity.repository_url,
    };
    return projectDTO;
};

export const getListProjectsResponse = (projectEntities: ProjectEntity[]) => {
    const projectDTOs: ProjectDTO[] = [];
    projectEntities.forEach((projectEntity: ProjectEntity) => {
        const projectDTO: ProjectDTO = {
            id: projectEntity.id,
            displayName: projectEntity.display_name,
            version: projectEntity.version,
            json: JSON.parse(projectEntity.json),
            ownerEmail: projectEntity.owner_email,
            createdAt: projectEntity.created_at,
            updatedAt: projectEntity.updated_at,
            gitPlatformUserName: projectEntity.git_platform_user_name,
            gitPlatformName: projectEntity.git_platform_name,
            repositoryName: projectEntity.repository_name,
            repositoryBranch: projectEntity.repository_branch,
            isRepositoryPublic: projectEntity.is_repository_public,
            repositoryUrl: projectEntity.repository_url,
            metadata: JSON.parse(projectEntity.metadata),
            oldVersions: projectEntity.old_versions ? projectEntity.old_versions.map((oldVersion) => {
                return JSON.parse(oldVersion);
            }) : [],
        };
        projectDTOs.push(projectDTO);
    });
    return projectDTOs;
};

export const getProjectEntity = (projectDTO: ProjectDTO) => {
    const projectEntity: ProjectEntity = {
        id: projectDTO.id,
        display_name: projectDTO.displayName,
        version: projectDTO.version,
        json: JSON.stringify(projectDTO.json),
        owner_email: projectDTO.ownerEmail,
        created_at: projectDTO.createdAt,
        updated_at: projectDTO.updatedAt,
        git_platform_user_name: projectDTO.gitPlatformUserName,
        git_platform_name: projectDTO.gitPlatformName,
        repository_name: projectDTO.repositoryName,
        repository_branch: projectDTO.repositoryBranch,
        is_repository_public: projectDTO.isRepositoryPublic,
        repository_url: projectDTO.repositoryUrl,
        metadata: JSON.stringify(projectDTO.metadata),
        old_versions: projectDTO.oldVersions ? projectDTO.oldVersions.map((oldVersion) => {
            return JSON.stringify(oldVersion);
        }) : [],
    };
    return projectEntity;
};

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

interface GetProjectError {
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

export const getGetProjectError = (message: string) => {
    const getProjectError: GetProjectError = {
        message,
    };
    return getProjectError;
};