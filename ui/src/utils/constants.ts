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
    proxy_url_create_repository: BackendBaseURL + "/github/create_repository",
    proxy_url_list_repositories: BackendBaseURL + "/github/list_repositories",
    proxy_url_commit_compage_yaml: BackendBaseURL + "/github/commit_compage_yaml",
    proxy_url_pull_compage_yaml: BackendBaseURL + "/github/pull_compage_yaml",
};