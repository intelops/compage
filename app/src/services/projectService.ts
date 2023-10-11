import {ProjectEntity} from '../models/project';
import {ProjectDao} from '../store/projectDao';
import {SqliteProjectDaoImpl} from '../store/sqliteProjectDaoImpl';
import {CassandraProjectDaoImpl} from '../store/cassandraProjectDaoImpl';
import config from '../utils/constants';

export class ProjectService {
    private projectDao: ProjectDao;

    constructor() {
        // create the appropriate projectDao based on the DB_TYPE
        if (config.db?.type === 'cassandra') {
            this.projectDao = new CassandraProjectDaoImpl();
        } else if (config.db?.type === 'sqlite') {
            this.projectDao = new SqliteProjectDaoImpl();
        } else {
            throw new Error('Invalid process.env.DB_TYPE');
        }
    }

    async createProject(project: ProjectEntity): Promise<ProjectEntity> {
        return await this.projectDao.createProject(project);
    }

    async listProjects(ownerEmail: string): Promise<ProjectEntity[]> {
        return await this.projectDao.listProjects(ownerEmail);
    }

    async getProject(ownerEmail: string): Promise<ProjectEntity> {
        return await this.projectDao.getProject(ownerEmail);
    }

    async updateProject(ownerEmail: string, projectEntity: ProjectEntity): Promise<boolean> {
        return await this.projectDao.updateProject(ownerEmail, projectEntity);
    }

    async deleteProject(ownerEmail: string): Promise<boolean> {
        return await this.projectDao.deleteProject(ownerEmail);
    }
}