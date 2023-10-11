import {GitPlatformEntity} from '../models/gitPlatform';

import {GitPlatformDao} from './gitPlatformDao';
import cassandraClient from './cassandra/cassandraClient';

export class CassandraGitPlatformDaoImpl implements GitPlatformDao {
    async createGitPlatform(gitPlatformEntity: GitPlatformEntity): Promise<GitPlatformEntity> {
        const query = `INSERT INTO git_platforms (name, url, user_name, personal_access_token, owner_email, created_at,
                                                  updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS`;
        const params = [gitPlatformEntity.name, gitPlatformEntity.url, gitPlatformEntity.user_name, gitPlatformEntity.personal_access_token, gitPlatformEntity.owner_email, gitPlatformEntity.created_at, gitPlatformEntity.updated_at];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        if (resultSet.wasApplied()) {
            return gitPlatformEntity;
        }
        return {
            name: '',
            url: '',
            user_name: '',
            personal_access_token: '',
            owner_email: ''
        };
    }

    async listGitPlatforms(ownerEmail: string): Promise<GitPlatformEntity[]> {
        const query = `SELECT *
                       FROM git_platforms
                       where owner_email = ? ALLOW FILTERING`;
        const params = [ownerEmail];
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

    async getGitPlatform(ownerEmail: string, name: string): Promise<GitPlatformEntity> {
        const query = `SELECT *
                       FROM git_platforms
                       WHERE owner_email = ?
                         and name = ?`;
        const params = [ownerEmail, name];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        const row = resultSet.first();
        if (!row) {
            return {
                name: '',
                url: '',
                user_name: '',
                personal_access_token: '',
                owner_email: ''
            };
        }

        return {
            created_at: row.created_at,
            updated_at: row.updated_at,
            name: row.name,
            url: row.url,
            user_name: row.user_name,
            personal_access_token: row.personal_access_token,
            owner_email: row.owner_email
        };
    }

    async updateGitPlatform(ownerEmail: string, name: string, gitPlatformEntity: GitPlatformEntity): Promise<boolean> {
        const query = `UPDATE git_platforms
                       SET url                   = ?,
                           user_name             = ?,
                           personal_access_token = ?,
                           updated_at            = ?
                       WHERE owner_email = ?
                         and name = ? IF EXISTS`;
        const params = [gitPlatformEntity.url, gitPlatformEntity.user_name, gitPlatformEntity.personal_access_token, gitPlatformEntity.updated_at, ownerEmail, name];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        return resultSet.wasApplied();
    }

    async deleteGitPlatform(ownerEmail: string, name: string): Promise<boolean> {
        const query = `DELETE
                       FROM git_platforms
                       WHERE owner_email = ?
                         and name = ?`;
        const params = [ownerEmail, name];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        return resultSet.wasApplied();
    }
}