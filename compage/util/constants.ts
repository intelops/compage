import * as dotenv from 'dotenv';

dotenv.config();
export const config = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    proxy_url_authenticate: process.env.REACT_APP_PROXY_URL_AUTHENTICATE,
    proxy_url_commit_changes: process.env.REACT_APP_PROXY_URL_COMMIT_CHANGES,
    proxy_url_pull_changes: process.env.REACT_APP_PROXY_URL_PULL_CHANGES,
    proxy_url_create_repo: process.env.REACT_APP_PROXY_URL_CREATE_REPO,
    proxy_url_list_repos: process.env.REACT_APP_PROXY_URL_LIST_REPOS,
    proxy_url_check_token: process.env.REACT_APP_PROXY_URL_CHECK_TOKEN,
    proxy_url_logout: process.env.REACT_APP_PROXY_URL_LOGOUT,
    proxy_url_generate_project: process.env.REACT_APP_PROXY_URL_GENERATE_PROJECT,
};
