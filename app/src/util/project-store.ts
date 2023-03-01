import {initializeEmptyProjectEntity, ProjectEntity, Repository} from "../routes/models";

import {project_group, project_kind, project_version, ProjectResource, ProjectResourceSpec} from "../store/models";
import {NAMESPACE} from "./constants";
import {
    createProjectResource,
    deleteProjectResource,
    getProjectResource,
    listProjectResources,
    patchProjectResource
} from "../store/project-client";

// convertProjectEntityToProjectResourceSpec creates projectResourceSpec on k8s cluster.
const convertProjectEntityToProjectResourceSpec = (projectId: string, userName: string, projectEntity: ProjectEntity) => {
    let repository: Repository = {
        branch: "",
        name: "",
    }

    // if repository name is not set, add displayName as repository name.
    if (!projectEntity.repository?.name) {
        repository.name = getSanitizedName(projectEntity.displayName);
    } else {
        repository.name = projectEntity.repository.name;
    }

    // if branch is not set, add "compage" as default branch.
    if (!projectEntity.repository?.branch) {
        repository.branch = "compage";
    } else {
        repository.branch = projectEntity.repository.branch;
    }

    const projectResourceSpec: ProjectResourceSpec = {
        id: projectId,
        displayName: projectEntity.displayName,
        metadata: JSON.stringify(projectEntity.metadata),
        user: projectEntity.user,
        json: JSON.stringify(projectEntity.json),
        repository: repository,
        version: projectEntity.version,
        oldVersions: []
    }
    return projectResourceSpec
}

// convertProjectResourceToProjectEntity converts projectResource to projectEntity
const convertProjectResourceToProjectEntity = (projectResource: ProjectResource) => {
    const projectEntity: ProjectEntity = {
        // TODO Metadata is not yet handled properly, need to check this.
        // metadata: JSON.parse(JSON.stringify(projectResource?.spec?.metadata)),
        id: projectResource.spec.id,
        displayName: projectResource.spec.displayName,
        repository: projectResource.spec.repository,
        user: projectResource.spec.user,
        version: projectResource.spec.version,
        json: JSON.parse(projectResource.spec.json) || {}
    }
    return projectEntity
}

// convertListOfProjectResourceToListOfProjectEntity converts projectResourceList to ProjectEntityList
const convertListOfProjectResourceToListOfProjectEntity = (projectResources: ProjectResource[]) => {
    let projectEntities: ProjectEntity[] = []
    for (let i = 0; i < projectResources.length; i++) {
        const projectEntity = convertProjectResourceToProjectEntity(projectResources[i])
        projectEntities.push(projectEntity)
    }
    return projectEntities
}

// getProjects returns all projects for userName supplied
export const listProjects = async (userName: string) => {
    let listOfProjectResource = await listProjectResources(NAMESPACE, "userName=" + userName);
    if (listOfProjectResource) {
        return convertListOfProjectResourceToListOfProjectEntity(JSON.parse(JSON.stringify(listOfProjectResource)));
    }
    return [];
}

// deleteProject deletes project for userName and projectId supplied
export const deleteProject = async (userName: string, projectId: string) => {
    const projectResource = await getProjectResource(NAMESPACE, projectId);
    if (projectResource?.metadata?.labels?.userName === userName) {
        await deleteProjectResource(NAMESPACE, projectId);
        return true
    }
    return false;
}

// getProject returns project for userName and projectId supplied
export const getProject = async (userName: string, projectId: string) => {
    // TODO I may need to apply labelSelector here - below impl is done temporarily.
    // currently added filter post projects retrieval(which can be slower if there are too many projects with same name.
    const projectResource = await getProjectResource(NAMESPACE, projectId);
    if (projectResource?.metadata?.labels?.userName === userName) {
        return convertProjectResourceToProjectEntity(projectResource)
    }
    return initializeEmptyProjectEntity();
}

// prepareProjectResource prepares ProjectResource containing the project details.
const prepareProjectResource = (projectId: string, userName: string, projectResourceSpec: ProjectResourceSpec) => {
    // create projectResource
    const projectResource: ProjectResource = {
        apiVersion: project_group + "/" + project_version,
        kind: project_kind,
        spec: projectResourceSpec,
        metadata: {
            name: projectId,
            namespace: NAMESPACE,
            labels: {
                userName: userName
            }
        }
    }
    return projectResource
}

const lengthOfChars = 5;

const containsSpecialChars = (character: string) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(character);
}

export const getSanitizedName = (name: string) => {
    const sanitizedName = name.substring(0, lengthOfChars);
    // check if last char is non-alphanumeric
    const lastCharacter = sanitizedName.charAt(sanitizedName.length - 1);
    if (containsSpecialChars(lastCharacter)) {
        // remove last character in sanitizedUserName.
        const slicedSanitizedName = name.slice(0, sanitizedName.length - 1);
        // append x to make it 5 characters string.
        return slicedSanitizedName + "x";
    }
    return sanitizedName;
};

// generateProjectId generates unique id for project.
const generateProjectId = (userName: string, projectName: string) => {
    // truncate userName if its length is greater than 5
    let sanitizedUserName = userName;
    if (userName.length > lengthOfChars) {
        sanitizedUserName = getSanitizedName(userName);
    }

    // truncate projectResourceSpec.name if its length is greater than 5
    let sanitizedProjectName;
    if (projectName.length > lengthOfChars) {
        sanitizedProjectName = getSanitizedName(projectName);
    } else {
        let appended = "";
        const count = lengthOfChars - projectName.length;
        for (let i = 0; i < count; i++) {
            appended += "x";
        }
        sanitizedProjectName = getSanitizedName(projectName) + appended;
    }

    return sanitizedUserName.toLowerCase() + "-" + sanitizedProjectName.toLowerCase() + "-" + (Math.floor(Math.random() * 90000) + 10000);
}

// createProject creates projectResource on k8s cluster.
export const createProject = async (userName: string, projectEntity: ProjectEntity) => {
    const projectId = generateProjectId(userName, projectEntity.displayName);
    const projectResourceSpec = convertProjectEntityToProjectResourceSpec(projectId, userName, projectEntity);
    const projectResource = prepareProjectResource(projectId, userName, projectResourceSpec);
    return convertProjectResourceToProjectEntity(await createProjectResource(NAMESPACE, JSON.stringify(projectResource)));
}

// updateProject updates projectResource on k8s cluster.
export const updateProject = async (projectId: string, userName: string, projectEntity: ProjectEntity) => {
    const existingProjectResource = await getProjectResource(NAMESPACE, projectId);
    // if some user is trying to modify the project not owned by him, reject it.
    if (existingProjectResource?.metadata?.labels?.userName !== userName) {
        return initializeEmptyProjectEntity();
    }
    // for non-existent resources apiVersion is empty.
    if (existingProjectResource.apiVersion) {
        if (projectEntity.displayName) {
            existingProjectResource.spec.displayName = projectEntity.displayName;
        }
        if (projectEntity.metadata) {
            existingProjectResource.spec.metadata = JSON.stringify(projectEntity.metadata);
        }
        if (projectEntity.version) {
            existingProjectResource.spec.version = projectEntity.version;
        }
        existingProjectResource.spec.id = projectId;
        existingProjectResource.spec.json = JSON.stringify(projectEntity.json);

        // send spec only as the called method considers updating specs only.
        // existingProjectResource.metadata.name = projectId here
        const patchedProjectResource = await patchProjectResource(NAMESPACE, existingProjectResource.metadata.name, JSON.stringify(existingProjectResource.spec));
        console.log(patchedProjectResource);
        if (patchedProjectResource.apiVersion) {
            return convertProjectResourceToProjectEntity(patchedProjectResource);
        }
    }
    return initializeEmptyProjectEntity();
}