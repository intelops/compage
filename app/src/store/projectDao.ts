import {ProjectEntity} from '../models/project';

export interface ProjectDao {
    createProject(projectEntity: ProjectEntity): Promise<ProjectEntity>;

    listProjects(ownerEmail: string): Promise<ProjectEntity[]>;

    getProject(id: string): Promise<ProjectEntity>;

    updateProject(id: string, projectEntity: ProjectEntity): Promise<boolean>;

    deleteProject(id: string): Promise<boolean>;
}