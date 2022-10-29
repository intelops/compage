// Auth
export interface AuthenticationModel {
    login?: string,
    email?: string,
    name?: string,
    following: string,
    followers: string,
    public_repos: string,
    avatar_url: string,
    bio: string
}

export interface AuthenticationArrayModel {
    user: AuthenticationModel
}

// compage
export interface GenerateProjectRequest {
    userName: string,
    repositoryName: string,
    projectName: string,
    yaml: string
}

export interface GeneratedProjectModel {
    "name": string,
    "fileChunk": any
}

export interface GeneratedProjectArrayModel {
    // In `status` we will watch
    // if todos are being loaded.
    status: "loading" | "idle";
    // `error` will contain an error message.
    error: string | null;
    generatedProject: GeneratedProjectModel
}

// github