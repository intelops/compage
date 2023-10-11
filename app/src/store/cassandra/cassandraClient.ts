import cassandra from 'cassandra-driver';
import config from '../../utils/constants';
import Logger from '../../utils/logger';

let cassandraClient: cassandra.Client = {} as cassandra.Client;

const initDB = async () => {
    // git_platforms table
    const gitPlatformsTable = `CREATE TABLE IF NOT EXISTS compage.git_platforms
                               (
                                   name                  TEXT,
                                   url                   TEXT,
                                   user_name             TEXT,
                                   personal_access_token TEXT,
                                   owner_email           TEXT,
                                   created_at            TIMESTAMP,
                                   updated_at            TIMESTAMP,
                                   PRIMARY KEY (name, owner_email)
                               );`;
    await cassandraClient.execute(gitPlatformsTable);
    const usersTable = `CREATE TABLE IF NOT EXISTS compage.users
                        (
                            email      TEXT PRIMARY KEY,
                            first_name TEXT,
                            last_name  TEXT,
                            role       TEXT,
                            status     TEXT,
                            created_at TIMESTAMP,
                            updated_at TIMESTAMP
                        );
    `;
    await cassandraClient.execute(usersTable);
    const projectsTable = `CREATE TABLE IF NOT EXISTS compage.projects
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
                           );`;
    await cassandraClient.execute(projectsTable);
};

if (config.db?.type === 'cassandra') {
    const contactPoints = config.db?.cassandra?.contactPoints as string[] || ['localhost'];
    const localDataCenter = config.db?.cassandra?.localDataCenter as string || 'datacenter1';
    const keyspace = config.db?.cassandra?.keyspace as string || 'compage';
    const authProvider = new cassandra.auth.PlainTextAuthProvider(config.db?.cassandra?.credentials?.username as string, config.db?.cassandra?.credentials?.password as string);
    cassandraClient = new cassandra.Client({
        contactPoints,
        authProvider,
        localDataCenter,
        keyspace
    });
}

// below check is required because cassandraClient is an empty object when DB_TYPE is sqlite
if (Object.keys(cassandraClient).length > 0) {
    cassandraClient.connect()
        .then(async () => {
            Logger.debug('connected to Cassandra');
            await initDB();
        })
        .catch((err: any) => {
            Logger.debug('error while connecting to Cassandra: ' + JSON.stringify(err));
        });
}

export default cassandraClient;