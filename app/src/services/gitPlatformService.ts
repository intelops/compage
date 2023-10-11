import {GitPlatformEntity} from '../models/gitPlatform';
import {GitPlatformDao} from '../store/gitPlatformDao';
import {SqliteGitPlatformDaoImpl} from '../store/sqliteGitPlatformDaoImpl';
import {CassandraGitPlatformDaoImpl} from '../store/cassandraGitPlatformDaoImpl';
import config from '../utils/constants';

export class GitPlatformService {
    private gitPlatformDao: GitPlatformDao;

    constructor() {
        // create the appropriate gitPlatformDao based on the DB_TYPE
        if (config.db?.type === 'cassandra') {
            this.gitPlatformDao = new CassandraGitPlatformDaoImpl();
        } else if (config.db?.type === 'sqlite') {
            this.gitPlatformDao = new SqliteGitPlatformDaoImpl();
        } else {
            throw new Error('Invalid process.env.DB_TYPE');
        }
    }

    async createGitPlatform(gitPlatform: GitPlatformEntity): Promise<GitPlatformEntity> {
        return await this.gitPlatformDao.createGitPlatform(gitPlatform);
    }

    async listGitPlatforms(ownerEmail: string): Promise<GitPlatformEntity[]> {
        return await this.gitPlatformDao.listGitPlatforms(ownerEmail);
    }

    async getGitPlatform(ownerEmail: string, name: string): Promise<GitPlatformEntity> {
        return await this.gitPlatformDao.getGitPlatform(ownerEmail, name);
    }

    async updateGitPlatform(ownerEmail: string, name: string, gitPlatformEntity: GitPlatformEntity): Promise<boolean> {
        return await this.gitPlatformDao.updateGitPlatform(ownerEmail, name, gitPlatformEntity);
    }

    async deleteGitPlatform(ownerEmail: string, name: string): Promise<boolean> {
        return await this.gitPlatformDao.deleteGitPlatform(ownerEmail, name);
    }
}