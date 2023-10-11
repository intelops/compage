import Logger from './logger';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

export const X_EMAIL_HEADER = 'X-Email-ID';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const CONFIG_PATH = `${os.homedir()}/.compage`;
export const WORKDIR_PATH = `${CONFIG_PATH}/workdir`;

export interface CassandraDBConfig {
    contactPoints?: string[];
    localDataCenter?: string;
    keyspace?: string;
    credentials?: {
        username?: string;
        password?: string;
    };
}

export interface SqliteDBConfig {
    storage: string;
}

export interface DbConfig {
    type: string;
    cassandra?: CassandraDBConfig;
    sqlite?: SqliteDBConfig;
}

export interface Config {
    // log path
    logPath: string;
    // app server config
    serverPort?: string | number;
    // db config
    db?: DbConfig;
    // core url
    compageCoreUrl?: string;
}

// read secret files from the given path - happens only in production [not in development or test] in containers
const readSecretFile = (secretPath: string) => {
    const keyValuePairs: Map<string, string> = new Map();
    const entries = fs.readdirSync(secretPath, {withFileTypes: true});
    for (const entry of entries) {
        if (!entry.isFile()) continue;
        const buf = fs.readFileSync(path.join(secretPath, entry.name), 'utf8');
        const toString = buf.toString();
        keyValuePairs.set(entry.name, toString);
    }
    return keyValuePairs;
};

// set NODE_ENV to development if not set
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = DEVELOPMENT;
}

Logger.info(`process.env.NODE_ENV:  ${process.env.NODE_ENV || DEVELOPMENT}`);
const isDevelopment = (process.env.NODE_ENV === DEVELOPMENT);
const isTest = (process.env.NODE_ENV === TEST);
let config: Config;
if (isDevelopment) {
    // use verbose logging
    // use server in development mode
    dotenv.config({path: `${CONFIG_PATH}/.env`});
    let db: DbConfig;
    if (process.env.DB_TYPE === 'cassandra') {
        db = {
            type: 'cassandra',
            cassandra: {
                contactPoints: process.env.CASSANDRA_CONTACT_POINTS?.split(','),
                localDataCenter: process.env.CASSANDRA_LOCAL_DATA_CENTER,
                keyspace: process.env.CASSANDRA_KEYSPACE,
                credentials: {
                    username: process.env.CASSANDRA_USERNAME,
                    password: process.env.CASSANDRA_PASSWORD
                }
            }
        };
    } else {
        db = {
            type: 'sqlite',
            sqlite: {
                storage: 'db.sqlite'
            }
        };
    }
    assert.ok(process.env.COMPAGE_CORE_URL, `The 'COMPAGE_CORE_URL' environment variable is required`);
    config = {
        // log path
        logPath: os.homedir() + '/.compage/logs',
        // db config
        db,
        // app server config
        serverPort: process.env.PORT || 5000,
        // compage-core url
        compageCoreUrl: process.env.COMPAGE_CORE_URL,
    };
} else if (isTest) {
    config = {
        // log path
        logPath: os.homedir() + '/.compage/logs',
        // app server config
        serverPort: 5000,
        // db config for testing is sqlite
        db: {
            type: 'sqlite',
            sqlite: {
                storage: 'db.sqlite'
            }
        },
        // core url
        compageCoreUrl: 'localhost:50001',
    };
} else {
    // use server in production mode
    // read db credentials from secret files for cassandra
    let db: DbConfig = {} as DbConfig;
    if (process.env.DB_TYPE === 'cassandra') {
        // read db-cassandra-credentials
        const cassandraMap = readSecretFile('/etc/db-cassandra-credentials/compage');
        const CASSANDRA_CONTACT_POINTS = cassandraMap.get('CASSANDRA_CONTACT_POINTS');
        const CASSANDRA_LOCAL_DATA_CENTER = cassandraMap.get('CASSANDRA_LOCAL_DATA_CENTER');
        const CASSANDRA_KEYSPACE = cassandraMap.get('CASSANDRA_KEYSPACE');
        const CASSANDRA_USERNAME = cassandraMap.get('CASSANDRA_USERNAME');
        const CASSANDRA_PASSWORD = cassandraMap.get('CASSANDRA_PASSWORD');

        assert.ok(CASSANDRA_CONTACT_POINTS, `The 'CASSANDRA_CONTACT_POINTS' environment variable is required`);
        assert.ok(CASSANDRA_LOCAL_DATA_CENTER, `The 'CASSANDRA_LOCAL_DATA_CENTER' environment variable is required`);
        assert.ok(CASSANDRA_KEYSPACE, `The 'CASSANDRA_KEYSPACE' environment variable is required`);
        assert.ok(CASSANDRA_USERNAME, `The 'CASSANDRA_USERNAME' environment variable is required`);
        assert.ok(CASSANDRA_PASSWORD, `The 'CASSANDRA_PASSWORD' environment variable is required`);

        db = {
            type: 'cassandra',
            cassandra: {
                contactPoints: CASSANDRA_CONTACT_POINTS.split(','),
                localDataCenter: CASSANDRA_LOCAL_DATA_CENTER,
                keyspace: CASSANDRA_KEYSPACE,
                credentials: {
                    username: CASSANDRA_USERNAME,
                    password: CASSANDRA_PASSWORD
                }
            }
        };
    }

    // the below env vars are available through config maps
    assert.ok(process.env.COMPAGE_CORE_URL, `The 'COMPAGE_CORE_URL' environment variable is required`);

    config = {
        // log path
        logPath: os.homedir() + '/.compage/logs',
        // app server config
        serverPort: process.env.PORT || 5000,
        // db config
        db,
        // core url
        compageCoreUrl: process.env.COMPAGE_CORE_URL,
    };
}

export default config;