import {createObject, getObject, listObjects, patchObject} from "./kube-client";
import {project_group, project_plural, project_version, ProjectResource, Resource, UserResource} from "./models";

// createProjectResource creates project resource
export const createProjectResource = async (namespace: string, payload: string) => {
    const object = await createObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, payload);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
}

// patchProjectResource patches project resource
export const patchProjectResource = async (namespace: string, name: string, payload: string) => {
    const object = await patchObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, name, payload);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
}

// getProjectResource gets user resource
export const getProjectResource = async (namespace: string, name: string) => {
    const object: Resource = await getObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, name);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
}

// listProjectResources lists project resources
export const listProjectResources = async (namespace: string, userName: string) => {
    const objects = await listObjects({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, "username=" + userName);
    const projectResources: ProjectResource[] = [];
    for (let i = 0; i < objects.items.length; i++) {
        let uR = objects.items[i];
        const projectResource: ProjectResource = {
            kind: uR.kind,
            apiVersion: uR.apiVersion,
            spec: uR.spec,
            metadata: uR.metadata
        };
        projectResources.push(projectResource);
    }
    return projectResources;
}