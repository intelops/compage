const assert = require('assert').strict
const fsp = require('fs').promises
const path = require('path')

const readSecretFile = async (secretPath: string) => {
    const keyValuePairs: Map<string, string> = new Map();
    const entries = await fsp.readdir(secretPath, {withFileTypes: true})
    for (const entry of entries) {
        if (!entry.isFile()) continue
        const buf = await fsp.readFile(path.join(secretPath, entry.name), 'utf8')
        keyValuePairs.set(entry.name, buf.toString())
    }
    return keyValuePairs
}
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
const isDevelopment = (process.env.NODE_ENV === 'development')
if (isDevelopment) {
    // use verbose logging
    // use server in development mode
    const homedir = require('os').homedir();
    require("dotenv").config({path: `${homedir}/.compage/.env`});
} else {
    console.log("Mahendra")
    readSecretFile('/etc/github-credentials').then(console.log).catch(console.log)
    readSecretFile('/etc/redis-credentials').then(console.log).catch(console.log)
}

// compage-app server config
const SERVER_PORT = process.env.PORT
console.log("isDevelopment : ", isDevelopment)
// github config
const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID
assert.ok(GITHUB_APP_CLIENT_ID, 'The "GITHUB_APP_CLIENT_ID" environment variable is required')
const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET
assert.ok(GITHUB_APP_CLIENT_SECRET, 'The "GITHUB_APP_CLIENT_SECRET" environment variable is required')
const GITHUB_APP_REDIRECT_URI = process.env.GITHUB_APP_REDIRECT_URI
assert.ok(GITHUB_APP_REDIRECT_URI, 'The "GITHUB_APP_REDIRECT_URI" environment variable is required')

// compage-core config
const COMPAGE_CORE_URL = process.env.COMPAGE_CORE_URL
assert.ok(COMPAGE_CORE_URL, 'The "COMPAGE_CORE_URL" environment variable is required')

// Redis host config
const REDIS_HOST = process.env.REDIS_HOST
assert.ok(REDIS_HOST, 'The "REDIS_HOST" environment variable is required')
const REDIS_PORT = process.env.REDIS_PORT
assert.ok(REDIS_PORT, 'The "REDIS_PORT" environment variable is required')
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
assert.ok(REDIS_PASSWORD, 'The "REDIS_PASSWORD" environment variable is required')
const REDIS_USERNAME = process.env.REDIS_USERNAME
assert.ok(REDIS_USERNAME, 'The "REDIS_USERNAME" environment variable is required')

export const config = {
    // compage-app server config
    server_port: SERVER_PORT || 5000,
    // github config
    client_id: GITHUB_APP_CLIENT_ID,
    redirect_uri: GITHUB_APP_REDIRECT_URI,
    client_secret: GITHUB_APP_CLIENT_SECRET,
    // compage-core url
    compage_core_url: COMPAGE_CORE_URL,
    // redis config
    redis_host: REDIS_HOST,
    redis_port: REDIS_PORT || "",
    redis_password: REDIS_PASSWORD,
    redis_username: REDIS_USERNAME
};
