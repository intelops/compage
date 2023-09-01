export interface GitPlatform {
    userName: string;
    name: string;
    url: string;
    token: string;
}

export interface CreateGitPlatformResponse {
    email?: string;
    gitPlatforms: GitPlatform[];
}

// This type describes the error object structure:
export type CreateGitPlatformError = {
    message: string;
};

// create project models
export interface CreateGitPlatformRequest {
    code: string;
}

export interface ListGitPlatformsResponse {
    gitPlatforms: GitPlatform[];
}

// This type describes the error object structure:
export type ListGitPlatformsError = {
    message: string;
};

// create project models
export interface ListGitPlatformsRequest {
    email: string;
}