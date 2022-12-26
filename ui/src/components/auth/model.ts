export interface LoginResponse {
    login?: string,
    email?: string,
    name?: string,
    following: string,
    followers: string,
    public_repos: string,
    owned_private_repos: string,
    avatar_url: string,
    bio: string
}

// This type describes the error object structure:
export type LoginError = {
    message: string;
};

// create project models
export interface LoginRequest {
    code: string,
}
