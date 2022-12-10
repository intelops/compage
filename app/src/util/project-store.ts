import {client} from "../db/redis";
import {CreateProjectRequest, ProjectEntity} from "../routes/models";


export const getProjects = async (username: string) => {
    let strings = await client.hGetAll(username);
    if (strings) {
        let projects: ProjectEntity[] = JSON.parse(JSON.stringify(strings))
        return projects
    }
    return [];
}

export const addProject = async (userName: string, createProjectRequest: CreateProjectRequest) => {
    const projectEntity: ProjectEntity = {
        name: createProjectRequest.projectName,
        metadata: createProjectRequest.metadata,
        user: createProjectRequest.user,
        yaml: createProjectRequest.yaml,
        repository: createProjectRequest.repository
    }
    await client.hSet(userName, projectEntity.name, JSON.stringify(projectEntity));
}