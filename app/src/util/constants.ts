const assert = require('assert').strict
const fs = require('fs')
const path = require('path')
export const NAMESPACE = "compage";
export const X_USER_NAME_HEADER = "X-User-Name";

const readSecretFile = (secretPath: string) => {
    const keyValuePairs: Map<string, string> = new Map();
    const entries = fs.readdirSync(secretPath, {withFileTypes: true})
    for (const entry of entries) {
        if (!entry.isFile()) continue
        const buf = fs.readFileSync(path.join(secretPath, entry.name), 'utf8')
        keyValuePairs.set(entry.name, buf.toString())
    }
    return keyValuePairs
}

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development"
}

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
const isDevelopment = (process.env.NODE_ENV === 'development')
let config: Config = {}
if (isDevelopment) {
    // use verbose logging
    // use server in development mode
    const homedir = require('os').homedir();
    require("dotenv").config({path: `${homedir}/.compage/.env`});
    assert.ok(process.env.GITHUB_APP_CLIENT_ID, 'The "GITHUB_APP_CLIENT_ID" environment variable is required')
    assert.ok(process.env.GITHUB_APP_CLIENT_SECRET, 'The "GITHUB_APP_CLIENT_SECRET" environment variable is required')
    assert.ok(process.env.GITHUB_APP_REDIRECT_URI, 'The "GITHUB_APP_REDIRECT_URI" environment variable is required')
    assert.ok(process.env.COMPAGE_CORE_URL, 'The "COMPAGE_CORE_URL" environment variable is required')
    assert.ok(process.env.REDIS_HOST, 'The "REDIS_HOST" environment variable is required')
    assert.ok(process.env.REDIS_PORT, 'The "REDIS_PORT" environment variable is required')
    assert.ok(process.env.REDIS_PASSWORD, 'The "REDIS_PASSWORD" environment variable is required')
    assert.ok(process.env.REDIS_USERNAME, 'The "REDIS_USERNAME" environment variable is required')
    config = {
        // app server config
        server_port: process.env.PORT || 5000,
        // github config
        client_id: process.env.GITHUB_APP_CLIENT_ID,
        redirect_uri: process.env.GITHUB_APP_REDIRECT_URI,
        client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
        // core url
        compage_core_url: process.env.COMPAGE_CORE_URL,
        // redis config
        redis_host: process.env.REDIS_HOST,
        redis_port: process.env.REDIS_PORT || "",
        redis_password: process.env.REDIS_PASSWORD,
        redis_username: process.env.REDIS_USERNAME
    }
} else {
    let GITHUB_APP_CLIENT_ID
    let GITHUB_APP_CLIENT_SECRET
    let REDIS_PASSWORD
    let REDIS_USERNAME
    // read github-credentials
    const githubMap = readSecretFile('/etc/github-credentials/compage')
    GITHUB_APP_CLIENT_ID = githubMap.get("GITHUB_APP_CLIENT_ID");
    GITHUB_APP_CLIENT_SECRET = githubMap.get("GITHUB_APP_CLIENT_SECRET");
    assert.ok(GITHUB_APP_CLIENT_ID, 'The "GITHUB_APP_CLIENT_ID" environment variable is required')
    assert.ok(GITHUB_APP_CLIENT_SECRET, 'The "GITHUB_APP_CLIENT_SECRET" environment variable is required')

    // read redis-credentials
    let redisMap = readSecretFile('/etc/redis-credentials/compage')
    REDIS_PASSWORD = redisMap.get("REDIS_PASSWORD");
    REDIS_USERNAME = redisMap.get("REDIS_USERNAME");
    assert.ok(REDIS_PASSWORD, 'The "REDIS_PASSWORD" environment variable is required')
    assert.ok(REDIS_USERNAME, 'The "REDIS_USERNAME" environment variable is required')

    // the below env vars are available through config maps
    assert.ok(process.env.GITHUB_APP_REDIRECT_URI, 'The "GITHUB_APP_REDIRECT_URI" environment variable is required')
    assert.ok(process.env.COMPAGE_CORE_URL, 'The "COMPAGE_CORE_URL" environment variable is required')
    assert.ok(process.env.REDIS_HOST, 'The "REDIS_HOST" environment variable is required')
    assert.ok(process.env.REDIS_PORT, 'The "REDIS_PORT" environment variable is required')

    config = {
        // app server config
        server_port: process.env.PORT || 5000,
        // github config
        client_id: GITHUB_APP_CLIENT_ID,
        redirect_uri: process.env.GITHUB_APP_REDIRECT_URI,
        client_secret: GITHUB_APP_CLIENT_SECRET,
        // core url
        compage_core_url: process.env.COMPAGE_CORE_URL,
        // redis config
        redis_host: process.env.REDIS_HOST,
        redis_port: process.env.REDIS_PORT || "",
        redis_password: REDIS_PASSWORD,
        redis_username: REDIS_USERNAME
    }
}

export interface Config {
    // app server config
    server_port?: string | number
    // github config
    client_id?: string
    redirect_uri?: string,
    client_secret?: string | undefined,
    // core url
    compage_core_url?: string,
    // redis config
    redis_host?: string,
    redis_port?: string,
    redis_password?: string,
    redis_username?: string
}

export default config