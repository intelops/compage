
export interface GitCredentials {
    repositoryName: string;
    repositoryIsPublic: boolean;
    repositoryBranch: string;
    platformName: string;
    platformUrl: string;
    platformUserName: string;
    platformPassword: string;
    platformEmail: string;
}

export interface PushNewProjectToGitServerRequest {
    projectVersion: string;
    generatedProjectPath: string;
    gitCredentials: GitCredentials;
}

export interface PushToExistingProjectOnGitServerRequest {
    projectVersion: string;
    generatedProjectPath: string;
    existingProject: string;
    gitCredentials: GitCredentials;
}