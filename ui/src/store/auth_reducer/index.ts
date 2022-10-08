import {config} from "../../utils/constants";

export const authConfig = {
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
};

export const backendEndpoints = {
    proxy_url_authenticate: config.proxy_url_authenticate,
    proxy_url_commit_changes: config.proxy_url_commit_changes,
    proxy_url_pull_changes: config.proxy_url_pull_changes,
    proxy_url_create_repo: config.proxy_url_create_repo,
    proxy_url_list_repos: config.proxy_url_list_repos,
    proxy_url_check_token: config.proxy_url_check_token,
    proxy_url_logout: config.proxy_url_logout,
}
