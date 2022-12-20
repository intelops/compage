import {ProjectEntity} from "../routes/models";
import {v4 as uuidv4} from 'uuid';

import {project_group, project_kind, project_version, ProjectResource, ProjectResourceSpec} from "../store/models";
import {NAMESPACE} from "./constants";
import {createProjectResource, getProjectResource, listProjectResources} from "../store/project-client";

const generateId = () => {
    let uuid = uuidv4();
    uuid = uuid.replace(/-/g, "");
    return Buffer.from(uuid, 'hex').toString('base64');
}

// convertProjectEntityToProjectResourceSpec creates projectResourceSpec on k8s cluster.
const convertProjectEntityToProjectResourceSpec = (userName: string, projectEntity: ProjectEntity) => {
    const projectResourceSpec: ProjectResourceSpec = {
        id: generateId(),
        name: projectEntity.name,
        metadata: JSON.stringify(projectEntity.metadata),
        user: projectEntity.user,
        yaml: JSON.stringify(projectEntity.yaml),
        repository: projectEntity.repository,
        version: projectEntity.version,
    }
    return projectResourceSpec
}

// convertListOfProjectResourceToListOfProjectEntity converts projectResourceList to ProjectEntityList
const convertListOfProjectResourceToListOfProjectEntity = (projectResources: ProjectResource[]) => {
    let projectEntities: ProjectEntity[] = []
    for (let i = 0; i < projectResources.length; i++) {
        let projectEntity: ProjectEntity = {
            metadata: JSON.parse(projectResources[i].spec.metadata),
            id: projectResources[i].spec.id,
            // metadata: projectResources[i].spec.metadata,
            name: projectResources[i].spec.name,
            repository: projectResources[i].spec.repository,
            user: projectResources[i].spec.user,
            version: projectResources[i].spec.version,
            yaml: JSON.parse(JSON.stringify(projectResources[i].spec.yaml))
        }
        projectEntities.push(projectEntity)
    }
    return projectEntities
}

// getProjects returns all projects for userName supplied
export const listProjects = async (userName: string) => {
    let listOfProjectResource = await listProjectResources(NAMESPACE, userName);
    if (listOfProjectResource) {
        return convertListOfProjectResourceToListOfProjectEntity(JSON.parse(JSON.stringify(listOfProjectResource)));
    }
    return [];
}

// getProject returns specific project for userName and projectName supplied
export const getProject = async (userName: string, name: string) => {
    // TODO I may need to apply labelSelector here
    const projectResource = await getProjectResource(NAMESPACE, name);
    if (projectResource) {
        return JSON.stringify(projectResource)
    }
    return [];
}

// prepareProjectResource prepares ProjectResource containing the project details.
const prepareProjectResource = (userName: string, projectResourceSpec: ProjectResourceSpec) => {
    // create projectResource
    const projectResource: ProjectResource = {
        apiVersion: project_group + "/" + project_version,
        kind: project_kind,
        spec: projectResourceSpec,
        metadata: {
            name: projectResourceSpec.name,
            namespace: NAMESPACE,
            labels: {
                userName: userName
            }
        }
    }
    console.log("projectResource : ", projectResource)
    return projectResource
}

// createProject creates projectResource on k8s cluster.
export const createProject = async (userName: string, projectEntity: ProjectEntity) => {
    const projectResourceSpec = convertProjectEntityToProjectResourceSpec(userName, projectEntity);
    const projectResource = prepareProjectResource(userName, projectResourceSpec);
    return await createProjectResource(NAMESPACE, JSON.stringify(projectResource));
}

// updateProject updates projectResource on k8s cluster.
// export const updateProject = async (projectName: string, userName: string, projectEntity: ProjectEntity) => {
//     const projectResourceSpec = convertProjectEntityToProjectResourceSpec(userName, projectEntity);
//     const projectResource = prepareProjectResource(userName, projectResourceSpec);
//     let createdProjectResource = await patchProjectResource(NAMESPACE, projectName, JSON.stringify(projectResource));
//     if (createdProjectResource.apiVersion) {
//         console.log(createdProjectResource.metadata.name + " project created")
//     } else {
//         console.log(projectResource.metadata.name + " project couldn't be created")
//     }
// }