const assert = require('assert').strict

// const configValue : string = process.env.REACT_APP_SOME_CONFIGURATION

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)

// github config
const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID
assert.ok(GITHUB_APP_CLIENT_ID, 'The "GITHUB_APP_CLIENT_ID" environment variable is required')
const GITHUB_APP_REDIRECT_URI = process.env.GITHUB_APP_REDIRECT_URI
assert.ok(GITHUB_APP_REDIRECT_URI, 'The "GITHUB_APP_REDIRECT_URI" environment variable is required')
// app server config
const COMPAGE_APP_SERVER_URL = process.env.COMPAGE_APP_SERVER_URL
assert.ok(COMPAGE_APP_SERVER_URL, 'The "COMPAGE_APP_SERVER_URL" environment variable is required')

let BackendBaseURL
if (process.env.NODE_ENV === 'development') {
    // export const
    BackendBaseURL = 'http://localhost:5000'
} else {
    // for container
    BackendBaseURL = COMPAGE_APP_SERVER_URL
}

export const config = {
    // github config
    client_id: GITHUB_APP_CLIENT_ID,
    redirect_uri: GITHUB_APP_REDIRECT_URI,
    backend_base_url: BackendBaseURL,

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