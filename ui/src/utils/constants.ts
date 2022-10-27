//TODO externalise the below keys
import {BackendBaseURL} from "../service/BackendApi";
export const config = {
    client_id: "5f8b8208ffa000316d2d",
    redirect_uri: "http://localhost:3000/login",
    proxy_url_authenticate: BackendBaseURL + "authenticate",
    proxy_url_create_repo: BackendBaseURL + "create_repo",
    proxy_url_generate_project: BackendBaseURL + "generate_project",
    proxy_url_list_repos: BackendBaseURL + "list_repos",
    proxy_url_check_token: BackendBaseURL + "check_token",
    proxy_url_logout: BackendBaseURL + "logout",
    proxy_url_commit_changes: BackendBaseURL + "commit_changes",
    proxy_url_pull_changes: BackendBaseURL + "pull_changes",
};