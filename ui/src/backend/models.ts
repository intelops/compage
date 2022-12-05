export interface GithubRepository {
    name: string,
    private: boolean,
    full_name: string
}

export interface GithubRepositoryContent {
    name: string,
    path: boolean,
    sha: string,
    content: string,
    type: string
    encoding: string,
}
export {}