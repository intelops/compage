export interface GitPlatformDTO {
    userName: string;
    name: string;
    url: string;
    token: string;
    ownerEmail: string;
}

// create project models
export interface CreateGitPlatformRequest extends GitPlatformDTO{
}

export interface CreateGitPlatformResponse {
    email?: string;
    gitPlatforms: GitPlatformDTO[];
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
    gitPlatforms: GitPlatformDTO[];
}

// This type describes the error object structure:
export interface ListGitPlatformsError {
    message: string;
}
