import {generateProjectId} from '../utils/utils';
import {ProjectEntity} from '../models/project';
import {cassandraClient} from './cassandra/cassandraClient';

import {ProjectDao} from './projectDao';

export class CassandraProjectDaoImpl implements ProjectDao {
    async createProject(projectEntity: ProjectEntity): Promise<ProjectEntity> {
        projectEntity.id = generateProjectId(projectEntity);
        const query = `INSERT INTO projects (id, display_name, version, json, git_platform_name, git_platform_user_name,
                                             is_repository_public, repository_branch, repository_name, owner_email,
                                             repository_url,
                                             created_at, updated_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) IF NOT EXISTS`;
        const params = [projectEntity.id, projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.git_platform_name, projectEntity.git_platform_user_name, projectEntity.is_repository_public, projectEntity.repository_branch, projectEntity.repository_name, projectEntity.owner_email, projectEntity.repository_url, projectEntity.created_at, projectEntity.updated_at];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        if (resultSet.wasApplied()) {
            return projectEntity;
        }
        return {
            id: '',
            display_name: '',
            version: '',
            json: '',
            git_platform_name: '',
            git_platform_user_name: '',
            is_repository_public: false,
            repository_branch: '',
            repository_name: '',
            repository_url: '',
            owner_email: '',
            created_at: '',
            updated_at: '',
        };
    }

    async listProjects(ownerEmail: string): Promise<ProjectEntity[]> {
        const query = `SELECT *
                       FROM projects
                       where owner_email = ? ALLOW FILTERING`;
        const params = [ownerEmail];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        const rows = resultSet.rows;
        const projectEntities: ProjectEntity[] = [];
        rows.forEach((row) => {
            const projectEntity: ProjectEntity = {
                id: row.id,
                display_name: row.display_name,
                git_platform_name: row.git_platform_name,
                git_platform_user_name: row.git_platform_user_name,
                is_repository_public: row.is_repository_public,
                repository_branch: row.repository_branch,
                repository_name: row.repository_name,
                version: row.version,
                json: row.json,
                owner_email: row.owner_email,
                repository_url: row.repository_url,
                created_at: row.created_at,
                updated_at: row.updated_at,
            };
            projectEntities.push(projectEntity);
        });

        return projectEntities;
    }

    async getProject(id: string): Promise<ProjectEntity> {
        const query = `SELECT *
                       FROM projects
                       WHERE id = ? ALLOW FILTERING`;
        const params = [id];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        const row = resultSet.first();
        if (!row) {
            return {
                id: '',
                display_name: '',
                version: '',
                json: '',
                git_platform_name: '',
                git_platform_user_name: '',
                is_repository_public: false,
                repository_branch: '',
                repository_name: '',
                repository_url: '',
                owner_email: '',
                created_at: '',
                updated_at: '',
            };
        }

        return {
            id: row.id,
            display_name: row.display_name,
            git_platform_name: row.git_platform_name,
            git_platform_user_name: row.git_platform_user_name,
            is_repository_public: row.is_repository_public,
            repository_branch: row.repository_branch,
            repository_name: row.repository_name,
            version: row.version,
            json: row.json,
            repository_url: row.repository_url,
            owner_email: row.owner_email,
            created_at: row.created_at,
            updated_at: row.updated_at,
        };
    }

    async updateProject(id: string, projectEntity: ProjectEntity): Promise<boolean> {
        const query = `UPDATE projects
                       SET display_name = ?,
                           version      = ?,
                           json         = ?,
                           updated_at   = ?
                       WHERE id = ? IF EXISTS`;
        const params = [projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.updated_at, id];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        return resultSet.wasApplied();
    }

    async deleteProject(id: string): Promise<boolean> {
        const query = `DELETE
                       FROM projects
                       WHERE id = ?`;
        const params = [id];
        const resultSet = await cassandraClient.execute(query, params, {prepare: true});
        return resultSet.wasApplied();
    }
}