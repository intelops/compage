import {ProjectEntity} from '../models/project';
import {ProjectDao} from '../store/projectDao';
import {SqliteProjectDaoImpl} from '../store/sqliteProjectDaoImpl';
import {CassandraProjectDaoImpl} from '../store/cassandraProjectDaoImpl';

export class ProjectService {
    private projectDao: ProjectDao;

    constructor() {
        // create the appropriate projectDao based on the environment
        this.projectDao = process.env.NODE_ENV === 'production'
            ? new CassandraProjectDaoImpl()
            : new SqliteProjectDaoImpl();
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