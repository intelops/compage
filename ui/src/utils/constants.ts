const assert = require('assert').strict

// const configValue : string = process.env.REACT_APP_SOME_CONFIGURATION

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)

// github config
const REACT_APP_GITHUB_APP_CLIENT_ID = process.env.REACT_APP_GITHUB_APP_CLIENT_ID
assert.ok(REACT_APP_GITHUB_APP_CLIENT_ID, 'The "REACT_APP_GITHUB_APP_CLIENT_ID" environment variable is required')
const REACT_APP_GITHUB_APP_REDIRECT_URI = process.env.REACT_APP_GITHUB_APP_REDIRECT_URI
assert.ok(REACT_APP_GITHUB_APP_REDIRECT_URI, 'The "REACT_APP_GITHUB_APP_REDIRECT_URI" environment variable is required')
// app server config
const REACT_APP_COMPAGE_APP_SERVER_URL = process.env.REACT_APP_COMPAGE_APP_SERVER_URL
assert.ok(REACT_APP_COMPAGE_APP_SERVER_URL, 'The "REACT_APP_COMPAGE_APP_SERVER_URL" environment variable is required')

export const config = {
    // github config
    client_id: REACT_APP_GITHUB_APP_CLIENT_ID,
    redirect_uri: REACT_APP_GITHUB_APP_REDIRECT_URI,
    backend_base_url: REACT_APP_COMPAGE_APP_SERVER_URL,

    // authRoutes
    proxy_url_check_token: REACT_APP_COMPAGE_APP_SERVER_URL + "/auth/check_token",
    proxy_url_logout: REACT_APP_COMPAGE_APP_SERVER_URL + "/auth/logout",

    // compageRoutes
    proxy_url_create_project: REACT_APP_COMPAGE_APP_SERVER_URL + "/compage/create_project",

    // githubRoutes
    proxy_url_create_repository: REACT_APP_COMPAGE_APP_SERVER_URL + "/github/create_repository",
    proxy_url_list_repositories: REACT_APP_COMPAGE_APP_SERVER_URL + "/github/list_repositories",
    proxy_url_commit_compage_yaml: REACT_APP_COMPAGE_APP_SERVER_URL + "/github/commit_compage_yaml",
    proxy_url_pull_compage_yaml: REACT_APP_COMPAGE_APP_SERVER_URL + "/github/pull_compage_yaml",
};