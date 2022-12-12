import {CreateProjectRequest, ProjectEntity} from "../routes/models";
import {uuid} from "uuidv4";
import {createProject, listProjects} from "../store/project-client";
import {ProjectResource} from "../store/models";

const NAMESPACE = "compage";
const createProjectResource = (userName: string, createProjectRequest: CreateProjectRequest) => {
    const projectResource: ProjectResource = {
        id: uuid(),
        name: createProjectRequest.project.name,
        metadata: JSON.stringify(createProjectRequest.metadata),
        user: createProjectRequest.user,
        yaml: JSON.stringify(createProjectRequest.yaml),
        repository: createProjectRequest.repository,
        //TODO needs to be parameterized
        version: "v1",
    }
    return JSON.stringify(projectResource)
}

const convertListOfProjectResourceToListOfProjectEntity = (projectResources: ProjectResource[]) => {
    let projectEntities: ProjectEntity[] = []
    for (let i = 0; i < projectResources.length; i++) {
        let projectEntity: ProjectEntity = {
            id: projectResources[i].id,
            metadata: JSON.parse(projectResources[i].metadata),
            name: projectResources[i].name,
            repository: projectResources[i].repository,
            user: projectResources[i].user,
            version: projectResources[i].version,
            yaml: JSON.parse(projectResources[i].yaml)
        }
        projectEntities.push(projectEntity)
    }
    return projectEntities
}

export const getProjects = async (userName: string) => {
    let listOfProjectResource = await listProjects(NAMESPACE, userName);
    if (listOfProjectResource) {
        const entities = convertListOfProjectResourceToListOfProjectEntity(JSON.parse(JSON.stringify(listOfProjectResource)));
        return JSON.stringify(entities)
    }
    return [];
}

export const addProject = async (userName: string, createProjectRequest: CreateProjectRequest) => {
    const projectResource = createProjectResource(userName, createProjectRequest);
    await createProject(NAMESPACE, projectResource);
}