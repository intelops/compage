import sqlite3 from 'sqlite3';
import Logger from '../../utils/logger';
import config from '../../utils/constants';

let db: sqlite3.Database = {} as sqlite3.Database;

if (config.db?.type === 'sqlite') {
    // Create and export the SQLite database connection
    db = new sqlite3.Database('compage-app.sqlite3');
    Logger.debug('connected to SQLite');
    db.run(`
        CREATE TABLE IF NOT EXISTS users
        (
            email      TEXT PRIMARY KEY,
            first_name TEXT,
            last_name  TEXT,
            role       TEXT,
            status     TEXT,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS projects
        (
            id                     TEXT,
            display_name           TEXT,
            version                TEXT,
            owner_email            TEXT,
            json                   TEXT,
            metadata               TEXT,
            old_versions           TEXT,
            git_platform_user_name TEXT,
            git_platform_name      TEXT,
            repository_name        TEXT,
            repository_branch      TEXT,
            is_repository_public   BOOLEAN,
            repository_url         TEXT,
            created_at             TIMESTAMP,
            updated_at             TIMESTAMP,
            PRIMARY KEY (id)
        )`
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS git_platforms
        (
            name                  TEXT,
            url                   TEXT,
            user_name             TEXT,
            personal_access_token TEXT,
            owner_email           TEXT,
            created_at            TIMESTAMP,
            updated_at            TIMESTAMP,
            PRIMARY KEY (name, owner_email)
        )`
    );
}
export default db;