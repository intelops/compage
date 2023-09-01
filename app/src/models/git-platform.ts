// entities
export interface GitPlatformEntity {
    name: string;
    url: string;
    user_name: string;
    personal_access_token: string;
    owner_email: string;
    created_at?: string;
    updated_at?: string;
}

export interface GitPlatformDTO {
    name: string;
    url: string;
    userName: string;
    personalAccessToken: string;
    ownerEmail: string;
    createdAt?: string;
    updatedAt?: string;
}

// requests
export interface CreateGitPlatformRequest extends GitPlatformDTO {

}

export interface DeleteGitPlatformRequest {

}

export interface UpdateGitPlatformRequest extends GitPlatformDTO {

}

export interface ListGitPlatformsRequest {

}

export const getCreateGitPlatformResponse = (gitPlatformEntity: GitPlatformEntity) => {
    const gitPlatformDTO: GitPlatformDTO = {
        name: gitPlatformEntity.name,
        url: gitPlatformEntity.url,
        userName: gitPlatformEntity.user_name,
        personalAccessToken: gitPlatformEntity.personal_access_token,
        ownerEmail: gitPlatformEntity.owner_email,
        createdAt: gitPlatformEntity.created_at,
        updatedAt: gitPlatformEntity.updated_at,
    }
    return gitPlatformDTO;
};

export const getGetGitPlatformResponse = (gitPlatformEntity: GitPlatformEntity) => {
    const gitPlatformDTO: GitPlatformDTO = {
        name: gitPlatformEntity.name,
        url: gitPlatformEntity.url,
        userName: gitPlatformEntity.user_name,
        personalAccessToken: gitPlatformEntity.personal_access_token,
        ownerEmail: gitPlatformEntity.owner_email,
        createdAt: gitPlatformEntity.created_at,
        updatedAt: gitPlatformEntity.updated_at,
    }
    return gitPlatformDTO;
};

export const getListGitPlatformsResponse = (gitPlatformEntities: GitPlatformEntity[]) => {
    const gitPlatformDTOs: GitPlatformDTO[] = [];
    gitPlatformEntities.forEach((gitPlatformEntity: GitPlatformEntity) => {
        const gitPlatformDTO: GitPlatformDTO = {
            name: gitPlatformEntity.name,
            url: gitPlatformEntity.url,
            userName: gitPlatformEntity.user_name,
            personalAccessToken: gitPlatformEntity.personal_access_token,
            ownerEmail: gitPlatformEntity.owner_email,
            createdAt: gitPlatformEntity.created_at,
            updatedAt: gitPlatformEntity.updated_at,
        }
        gitPlatformDTOs.push(gitPlatformDTO);
    });
    return gitPlatformDTOs;
};

export const getGitPlatformEntity = (gitPlatformDTO: GitPlatformDTO) => {
    const gitPlatformEntity: GitPlatformEntity = {
        name: gitPlatformDTO.name,
        url: gitPlatformDTO.url,
        user_name: gitPlatformDTO.userName,
        personal_access_token: gitPlatformDTO.personalAccessToken,
        owner_email: gitPlatformDTO.ownerEmail,
        created_at: gitPlatformDTO.createdAt,
        updated_at: gitPlatformDTO.updatedAt,
    };
    return gitPlatformEntity;
}

// errors
interface CreateGitPlatformError {
    message: string;
}

interface DeleteGitPlatformError {
    message: string;
}

interface UpdateGitPlatformError {
    message: string;
}

interface ListGitPlatformsError {
    message: string;
}

interface GetGitPlatformError {
    message: string;
}

export const getCreateGitPlatformError = (message: string) => {
    const createGitPlatformError: CreateGitPlatformError = {
        message: message,
    };
    return createGitPlatformError;
};

export const getUpdateGitPlatformError = (message: string) => {
    const updateGitPlatformError: UpdateGitPlatformError = {
        message: message,
    };
    return updateGitPlatformError;
};

export const getDeleteGitPlatformError = (message: string) => {
    const deleteGitPlatformError: DeleteGitPlatformError = {
        message: message,
    };
    return deleteGitPlatformError;
};

export const getListGitPlatformsError = (message: string) => {
    const listGitPlatformsError: ListGitPlatformsError = {
        message: message,
    };
    return listGitPlatformsError;
};

export const getGetGitPlatformError = (message: string) => {
    const getGitPlatformError: GetGitPlatformError = {
        message: message,
    };
    return getGitPlatformError;
};