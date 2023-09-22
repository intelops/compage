import {GitPlatformEntity} from '../models/gitPlatform';
import db from './sqlite/sqliteClient';
import {GitPlatformDao} from './gitPlatformDao';

export class SqliteGitPlatformDaoImpl implements GitPlatformDao {
    async createGitPlatform(gitPlatformEntity: GitPlatformEntity): Promise<GitPlatformEntity> {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT INTO git_platforms (name, url, user_name, personal_access_token, owner_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
            stmt.run(gitPlatformEntity.name, gitPlatformEntity.url, gitPlatformEntity.user_name, gitPlatformEntity.personal_access_token, gitPlatformEntity.owner_email, gitPlatformEntity.created_at, gitPlatformEntity.updated_at, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(gitPlatformEntity);
                }
                stmt.finalize();
            });
        });
    }

    async listGitPlatforms(ownerEmail: string): Promise<GitPlatformEntity[]> {
        const query = `SELECT *
                       FROM git_platforms
                       where owner_email = ?`;
        const params = [ownerEmail];
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows: GitPlatformEntity[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows) {
                        resolve(rows);
                    }
                    const gitPlatformEntities: GitPlatformEntity[] = [];
                    resolve(gitPlatformEntities);
                }
            });
        });
    }

    async getGitPlatform(ownerEmail: string, name: string): Promise<GitPlatformEntity> {
        const query = `SELECT *
                       FROM git_platforms
                       WHERE owner_email = ?
                         and name = ?`;
        const params = [ownerEmail, name];
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row: GitPlatformEntity) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve(row);
                    }
                    const gitPlatformEntity: GitPlatformEntity = {
                        name: '',
                        url: '',
                        user_name: '',
                        personal_access_token: '',
                        owner_email: ''
                    };
                    resolve(gitPlatformEntity);
                }
            });
        });
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
        return new Promise<boolean>((resolve, reject) => {
            const stmt = db.prepare(query);
            stmt.run(params, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
                stmt.finalize();
            });
        });
    }

    async deleteGitPlatform(ownerEmail: string, name: string): Promise<boolean> {
        const query = `DELETE
                       FROM git_platforms
                       WHERE owner_email = ?
                         and name = ?`;
        const params = [ownerEmail, name];
        return new Promise((resolve, reject) => {
            const stmt = db.prepare(query);
            stmt.run(params, (err: any) => {
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
