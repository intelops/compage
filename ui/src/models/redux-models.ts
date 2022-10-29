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
export interface CreateProjectRequest {
    userName: string,
    repositoryName: string,
    projectName: string,
    yaml: string,
    email: string
}

export interface CreatedProjectModel {
    "name": string,
    "fileChunk": any
}

export interface CreatedProjectArrayModel {
    // In `status` we will watch
    // if todos are being loaded.
    status: "loading" | "idle";
    // `error` will contain an error message.
    error: string | null;
    createdProject: CreatedProjectModel
}

// github