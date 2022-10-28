//TODO externalise the below keys
import BackendBaseURL from "../service/backend-api";

export const config = {
    client_id: "5f8b8208ffa000316d2d",
    redirect_uri: "http://localhost:3000/login",
    // authRoutes
    proxy_url_check_token: BackendBaseURL + "/auth/check_token",
    proxy_url_logout: BackendBaseURL + "/auth/logout",

    // compageRoutes
    proxy_url_create_project: BackendBaseURL + "/compage/create_project",

    // githubRoutes
    proxy_url_create_repo: BackendBaseURL + "/github/create_repo",
    proxy_url_list_repos: BackendBaseURL + "/github/list_repos",
    proxy_url_commit_changes: BackendBaseURL + "/github/commit_changes",
    proxy_url_pull_changes: BackendBaseURL + "/github/pull_changes",
};