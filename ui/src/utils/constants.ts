import assert from 'assert';

// const configValue : string = process.env.REACT_APP_SOME_CONFIGURATION
export const DEVELOPMENT = 'development';

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
console.log("process.env.REACT_APP_GITHUB_APP_CLIENT_ID: ", process.env.REACT_APP_GITHUB_APP_CLIENT_ID);
console.log("process.env.REACT_APP_GITHUB_APP_REDIRECT_URI: ", process.env.REACT_APP_GITHUB_APP_REDIRECT_URI);
console.log("process.env.REACT_APP_COMPAGE_APP_SERVER_URL: ", process.env.REACT_APP_COMPAGE_APP_SERVER_URL);

// github config
const REACT_APP_GITHUB_APP_CLIENT_ID = process.env.REACT_APP_GITHUB_APP_CLIENT_ID;
assert.ok(REACT_APP_GITHUB_APP_CLIENT_ID, 'The "REACT_APP_GITHUB_APP_CLIENT_ID" environment variable is required');
const REACT_APP_GITHUB_APP_REDIRECT_URI = process.env.REACT_APP_GITHUB_APP_REDIRECT_URI;
assert.ok(REACT_APP_GITHUB_APP_REDIRECT_URI, 'The "REACT_APP_GITHUB_APP_REDIRECT_URI" environment variable is required');
// app server config
const REACT_APP_COMPAGE_APP_SERVER_URL = process.env.REACT_APP_COMPAGE_APP_SERVER_URL;
assert.ok(REACT_APP_COMPAGE_APP_SERVER_URL, 'The "REACT_APP_COMPAGE_APP_SERVER_URL" environment variable is required');

export const config = {
    client_id: REACT_APP_GITHUB_APP_CLIENT_ID,
    redirect_uri: REACT_APP_GITHUB_APP_REDIRECT_URI,
    backend_base_url: REACT_APP_COMPAGE_APP_SERVER_URL,
};