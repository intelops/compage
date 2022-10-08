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

export interface TodoModel {
    "userId": number,
    "id": number,
    "title": string,
    "completed": boolean
}

export interface TodoArrayModel {
    all_todos: TodoModel[],
    particular_todo: TodoModel
}