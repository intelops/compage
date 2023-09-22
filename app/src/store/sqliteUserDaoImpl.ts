import {UserEntity} from '../models/user';
import {UserDao} from './userDao';
import db from './sqlite/sqliteClient';

export class SqliteUserDaoImpl implements UserDao {

    async createUser(userEntity: UserEntity): Promise<UserEntity> {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('INSERT INTO users (email, first_name, last_name, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
            stmt.run(userEntity.email, userEntity.first_name, userEntity.last_name, userEntity.role, userEntity.status, userEntity.created_at, userEntity.updated_at, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(userEntity);
                }
                stmt.finalize();
            });
        });
    }

    async listUsers(): Promise<UserEntity[]> {
        return new Promise((resolve, reject) => {
            db.all('SELECT *FROM users', (err, rows: UserEntity[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows) {
                        resolve(rows);
                    }
                    const userEntities: UserEntity[] = [];
                    resolve(userEntities);
                }
            });
        });
    }

    async getUser(email: string): Promise<UserEntity> {
        return new Promise((resolve, reject) => {
            db.get('SELECT *FROM users WHERE email = ?', [email], (err, row: UserEntity) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve(row);
                    }
                    const userEntity: UserEntity = {
                        email: ''
                    };
                    resolve(userEntity);
                }
            });
        });
    }

    async updateUser(email: string, userEntity: UserEntity): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const stmt = db.prepare('UPDATE users SET first_name = ?, last_name  = ?, role = ?, status = ?, updated_at = ? WHERE email = ?');
            stmt.run(userEntity.first_name, userEntity.last_name, userEntity.role, userEntity.status, userEntity.updated_at, email, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
                stmt.finalize();
            });
        });
    }

    async deleteUser(email: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare('DELETE FROM users WHERE email = ?');
            stmt.run(email, (err: any) => {
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
