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
    gitProviderDetails: GitProviderDetails;
    generatedProjectPath: string;
}

export interface ExistingProjectGitServerRequest {
    projectName: string;
    projectVersion: string;
    repositoryName: string;
    gitProviderDetails: GitProviderDetails;
    clonedProjectPath: string;
    generatedProjectPath: string;
}