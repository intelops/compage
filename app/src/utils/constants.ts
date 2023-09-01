import Logger from './logger';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import os from 'os';

export const X_EMAIL_HEADER = 'X-Email-ID';
export const DEVELOPMENT = 'development';
export const TEST = 'test';

const readSecretFile = (secretPath: string) => {
    const keyValuePairs: Map<string, string> = new Map();
    const entries = fs.readdirSync(secretPath, {withFileTypes: true});
    for (const entry of entries) {
        if (!entry.isFile()) continue;
        const buf = fs.readFileSync(path.join(secretPath, entry.name), 'utf8');
        keyValuePairs.set(entry.name, buf.toString());
    }
    return keyValuePairs;
};

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
    dotenv.config({path: `${os.homedir()}/.compage/.env`});
    assert.ok(process.env.COMPAGE_CORE_URL, `The 'COMPAGE_CORE_URL' environment variable is required`);
    config = {
        // db config
        db: {
            sqlite: {
                storage: 'db.sqlite'
            }
        },
        // app server config
        serverPort: process.env.PORT || 5000,
        // core url
        compageCoreUrl: process.env.COMPAGE_CORE_URL,
        // system_namespace
        systemNamespace: process.env.SYSTEM_NAMESPACE || 'compage'
    };
} else if (isTest) {
    config = {
        // app server config
        serverPort: 5000,
        // db config
        db: {
            sqlite: {
                storage: 'db.sqlite'
            }
        },
        // core url
        compageCoreUrl: 'localhost:50001',
        // system_namespace
        systemNamespace: 'compage'
    };
} else {
    let CASSANDRA_CONTACT_POINTS;
    let CASANDRA_LOCAL_DATA_CENTER;
    let CASANDRA_KEYSPACE;
    let CASSANDRA_USERNAME;
    let CASSANDRA_PASSWORD;

    // read db-cassandra-credentials
    const cassandraMap = readSecretFile('/etc/db-cassandra-credentials/compage');
    CASSANDRA_CONTACT_POINTS = cassandraMap.get('CASSANDRA_CONTACT_POINTS');
    CASANDRA_LOCAL_DATA_CENTER = cassandraMap.get('CASANDRA_LOCAL_DATA_CENTER');
    CASANDRA_KEYSPACE = cassandraMap.get('CASANDRA_KEYSPACE');
    CASSANDRA_USERNAME = cassandraMap.get('CASSANDRA_USERNAME');
    CASSANDRA_PASSWORD = cassandraMap.get('CASSANDRA_PASSWORD');

    assert.ok(CASSANDRA_CONTACT_POINTS, `The 'CASSANDRA_CONTACT_POINTS' environment variable is required`);
    assert.ok(CASANDRA_LOCAL_DATA_CENTER, `The 'CASANDRA_LOCAL_DATA_CENTER' environment variable is required`);
    assert.ok(CASANDRA_KEYSPACE, `The 'CASANDRA_KEYSPACE' environment variable is required`);
    assert.ok(CASSANDRA_USERNAME, `The 'CASSANDRA_USERNAME' environment variable is required`);
    assert.ok(CASSANDRA_PASSWORD, `The 'CASSANDRA_PASSWORD' environment variable is required`);

    // the below env vars are available through config maps
    assert.ok(process.env.COMPAGE_CORE_URL, `The 'COMPAGE_CORE_URL' environment variable is required`);

    config = {
        // app server config
        serverPort: process.env.PORT || 5000,
        db: {
            cassandra: {
                contactPoints: CASSANDRA_CONTACT_POINTS.split(','),
                localDataCenter: CASANDRA_LOCAL_DATA_CENTER,
                keyspace: CASANDRA_KEYSPACE,
                credentials: {
                    username: CASSANDRA_USERNAME,
                    password: CASSANDRA_PASSWORD
                }
            }
        },
        // core url
        compageCoreUrl: process.env.COMPAGE_CORE_URL,
        // system_namespace
        systemNamespace: process.env.SYSTEM_NAMESPACE || 'compage'
    };
}

export interface Config {
    // app server config
    serverPort?: string | number;
    // cassandra config
    db?: {
        cassandra?: {
            contactPoints?: string[];
            localDataCenter?: string;
            keyspace?: string;
            credentials?: {
                username: string;
                password: string;
            }
        },
        sqlite?: {}
    };
    // core url
    compageCoreUrl?: string;
    systemNamespace: string;
}

export default config;