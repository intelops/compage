import {GitPlatformEntity} from '../models/gitPlatform';
import {GitPlatformDao} from '../store/gitPlatformDao';
import {SqliteGitPlatformDaoImpl} from '../store/sqliteGitPlatformDaoImpl';
import {CassandraGitPlatformDaoImpl} from '../store/cassandraGitPlatformDaoImpl';

export class GitPlatformService {
    private gitPlatformDao: GitPlatformDao;

    constructor() {
        // create the appropriate gitPlatformDao based on the environment
        this.gitPlatformDao = process.env.NODE_ENV === 'production'
            ? new CassandraGitPlatformDaoImpl()
            : new SqliteGitPlatformDaoImpl();
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