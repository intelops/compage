import assert from 'assert';

// const configValue : string = process.env.REACT_APP_SOME_CONFIGURATION
export const DEVELOPMENT = 'development';

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
console.log("process.env.REACT_APP_COMPAGE_APP_SERVER_URL: ", process.env.REACT_APP_COMPAGE_APP_SERVER_URL);

// app server config
const REACT_APP_COMPAGE_APP_SERVER_URL = process.env.REACT_APP_COMPAGE_APP_SERVER_URL;
assert.ok(REACT_APP_COMPAGE_APP_SERVER_URL, 'The "REACT_APP_COMPAGE_APP_SERVER_URL" environment variable is required');

export const config = {
    backend_base_url: REACT_APP_COMPAGE_APP_SERVER_URL,
};