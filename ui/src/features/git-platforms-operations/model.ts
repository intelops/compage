export interface GitPlatformDTO {
    name: string;
    url: string;
    userName: string;
    personalAccessToken: string;
    ownerEmail: string;
    createdAt?: string;
    updatedAt?: string;
}

// create project models
export interface CreateGitPlatformRequest extends GitPlatformDTO{
}

// This type describes the error object structure:
export interface CreateGitPlatformError {
    message: string;
}

// create project models
export interface ListGitPlatformsRequest {
    email: string;
}

// This type describes the error object structure:
export interface ListGitPlatformsError {
    message: string;
}
