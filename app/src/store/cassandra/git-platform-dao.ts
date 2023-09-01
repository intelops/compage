import {GitPlatformEntity} from "../../models/git-platform";
import {cassandraClient} from "./cassandra-client";

export const createGitPlatform = async (gitPlatformEntity: GitPlatformEntity) => {
    const query = `INSERT INTO git_platforms (name, url, user_name, personal_access_token, owner_email, created_at,
                                             updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS`;
    const params = [gitPlatformEntity.name, gitPlatformEntity.url, gitPlatformEntity.user_name, gitPlatformEntity.personal_access_token, gitPlatformEntity.owner_email, gitPlatformEntity.created_at, gitPlatformEntity.updated_at];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    if (resultSet.wasApplied()) {
        return gitPlatformEntity;
    }
    const gitPlatformEntityError: GitPlatformEntity = {
        name: "",
        url: "",
        user_name: "",
        personal_access_token: "",
        owner_email: ""
    }
    return gitPlatformEntityError;
}

export const updateGitPlatform = async (owner_email: string, name: string, gitPlatformEntity: GitPlatformEntity) => {
    const query = `UPDATE git_platforms
                   SET name                  = ?,
                       url                   = ?,
                       user_name             = ?,
                       personal_access_token = ?,
                       updated_at            = ?
                   WHERE owner_email = ?
                     and name = ? IF EXISTS`;
    const params = [gitPlatformEntity.name, gitPlatformEntity.url, gitPlatformEntity.user_name, gitPlatformEntity.personal_access_token, gitPlatformEntity.updated_at, owner_email, name];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();
}

export const deleteGitPlatform = async (ownerEmail: string, name: string) => {
    const query = `DELETE
                   FROM git_platforms
                   WHERE owner_email = ?
                     and name = ?`;
    const params = [ownerEmail, name];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    return resultSet.wasApplied();

}

export const listGitPlatforms = async (owner_email: string) => {
    console.log("owner_email: ", owner_email)
    const query = `SELECT *
                   FROM git_platforms
                   where owner_email = ? ALLOW FILTERING`;
    const params = [owner_email];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    const rows = resultSet.rows;
    const gitPlatformEntities: GitPlatformEntity[] = [];
    rows.forEach((row) => {
        const gitPlatformEntity: GitPlatformEntity = {
            created_at: row.created_at,
            updated_at: row.updated_at,
            name: row.name,
            url: row.url,
            user_name: row.user_name,
            personal_access_token: row.personal_access_token,
            owner_email: row.owner_email
        };
        gitPlatformEntities.push(gitPlatformEntity);
    });

    return gitPlatformEntities;
}

export const getGitPlatform = async (ownerEmail: string, name: string) => {
    const query = `SELECT *
                   FROM git_platforms
                   WHERE owner_email = ?
                     and name = ?`;
    const params = [ownerEmail, name];
    const resultSet = await cassandraClient.execute(query, params, {prepare: true});
    const row = resultSet.first();
    if (!row) {
        const gitPlatformEntity: GitPlatformEntity = {
            name: "",
            url: "",
            user_name: "",
            personal_access_token: "",
            owner_email: ""
        }
        return gitPlatformEntity;
    }

    const gitPlatformEntity: GitPlatformEntity = {
        created_at: row.created_at,
        updated_at: row.updated_at,
        name: row.name,
        url: row.url,
        user_name: row.user_name,
        personal_access_token: row.personal_access_token,
        owner_email: row.owner_email
    };

    return gitPlatformEntity;
}
