export interface GitProviderDetails {
    repositoryName: string;
    repositoryIsPublic: boolean;
    repositoryBranch: string;
    platformName: string;
    platformUrl: string;
    platformUserName: string;
    platformPersonalAccessToken: string;
    platformEmail: string;
}

export interface NewProjectGitServerRequest {
    projectVersion: string;
    generatedProjectPath: string;
    gitProviderDetails: GitProviderDetails;
}

export interface ExistingProjectGitServerRequest {
    clonedProjectPath: string;
    existingProject: string;
    projectVersion: string;
    generatedProjectPath: string;
    gitProviderDetails: GitProviderDetails;
}