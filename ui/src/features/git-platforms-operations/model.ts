export interface GitPlatformDTO {
    name: string;
    url: string;
    userName: string;
    personalAccessToken: string;
    ownerEmail: string;
    createdAt?: string;
    updatedAt?: string;
}

// create gitPlatform models
export interface CreateGitPlatformRequest extends GitPlatformDTO {
}

// This type describes the error object structure:
export interface CreateGitPlatformError {
    message: string;
}

// List gitPlatforms models
export interface ListGitPlatformsRequest {
    email: string;
}

// This type describes the error object structure:
export interface ListGitPlatformsError {
    message: string;
}

// update gitPlatform models
export interface UpdateGitPlatformRequest extends GitPlatformDTO {
}

// This type describes the error object structure:
export interface UpdateGitPlatformError {
    message: string;
}

// delete gitPlatform models
export interface DeleteGitPlatformRequest {
    email: string;
    name: string;
}

// This type describes the error object structure:
export interface DeleteGitPlatformError {
    message: string;
}
