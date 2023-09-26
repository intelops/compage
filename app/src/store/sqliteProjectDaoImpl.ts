import {ProjectEntity} from '../models/project';
import {generateProjectId} from '../utils/utils';
import db from './sqlite/sqliteClient';
import {ProjectDao} from './projectDao';

export class SqliteProjectDaoImpl implements ProjectDao {
    async createProject(projectEntity: ProjectEntity): Promise<ProjectEntity> {
        projectEntity.id = generateProjectId(projectEntity);
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT INTO projects (id, display_name, version, json, git_platform_name, git_platform_user_name, is_repository_public, repository_branch, repository_name, owner_email, repository_url, metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            stmt.run(projectEntity.id, projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.git_platform_name, projectEntity.git_platform_user_name, projectEntity.is_repository_public, projectEntity.repository_branch, projectEntity.repository_name, projectEntity.owner_email, projectEntity.repository_url, projectEntity.metadata, projectEntity.created_at, projectEntity.updated_at, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(projectEntity);
                }
                stmt.finalize();
            });
        });
    }

    async listProjects(ownerEmail: string): Promise<ProjectEntity[]> {
        const query = `SELECT *
                       FROM projects
                       where owner_email = ?`;
        const params = [ownerEmail];
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows: ProjectEntity[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows) {
                        resolve(rows);
                    }
                    const projectEntities: ProjectEntity[] = [];
                    resolve(projectEntities);
                }
            });
        });
    }

    async getProject(id: string): Promise<ProjectEntity> {
        const query = `SELECT *
                       FROM projects
                       WHERE id = ?`;
        const params = [id];
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row: ProjectEntity) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve(row);
                    }
                    const projectEntity: ProjectEntity = {
                        id: '',
                        display_name: '',
                        version: '',
                        owner_email: '',
                        json: '',
                        git_platform_user_name: '',
                        git_platform_name: '',
                        repository_name: '',
                        repository_branch: '',
                        is_repository_public: false,
                        repository_url: '',
                        metadata: '',
                        old_versions: [],
                    };
                    resolve(projectEntity);
                }
            });
        });
    }

    async updateProject(id: string, projectEntity: ProjectEntity): Promise<boolean> {
        const query = `UPDATE projects
                       SET display_name = ?,
                           version      = ?,
                           json         = ?,
                           metadata     = ?,
                           old_versions = ?,
                           updated_at   = ?
                       WHERE id = ?`;
        return new Promise<boolean>((resolve, reject) => {
            const stmt = db.prepare(query);
            stmt.run(projectEntity.display_name, projectEntity.version, projectEntity.json, projectEntity.metadata, projectEntity.old_versions, projectEntity.updated_at, id, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
                stmt.finalize();
            });
        });
    }

    async deleteProject(id: string): Promise<boolean> {
        const query = `DELETE
                       FROM projects
                       WHERE id = ?`;
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(query);
            stmt.run(id, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
                stmt.finalize();
            });
        });
    }
}
