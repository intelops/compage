export interface GithubRepo {
    name: string,
    private: boolean,
    full_name: string
}

export interface GithubRepoContent {
    name: string,
    path: boolean,
    sha: string,
    content: string,
    type: string
    encoding: string,
}
export {}