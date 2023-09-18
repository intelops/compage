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

export interface CreateGitPlatformResponse {
}

// This type describes the error object structure:
export interface CreateGitPlatformError {
    message: string;
}

// create project models
export interface ListGitPlatformsRequest {
    email: string;
}

export interface ListGitPlatformsResponse {
}

// This type describes the error object structure:
export interface ListGitPlatformsError {
    message: string;
}
