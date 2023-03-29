import {createObject, deleteObject, getObject, listObjects, patchObject} from "./kube-client";
import {project_group, project_plural, project_version, ProjectResource, Resource} from "./models";

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
    const patch = [{
        "op": "replace",
        "path": "/spec",
        "value": JSON.parse(payload)
    }];

    const object = await patchObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, name, JSON.stringify(patch));
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
}

// deleteProjectResource deletes user resource
export const deleteProjectResource = async (namespace: string, projectId: string) => {
    await deleteObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, projectId);
}

// getProjectResource gets user resource
export const getProjectResource = async (namespace: string, projectId: string) => {
    const object: Resource = await getObject({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, projectId);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
}

// listProjectResources lists project resources
export const listProjectResources = async (namespace: string, labelSelector: string) => {
    const objects = await listObjects({
        group: project_group,
        version: project_version,
        plural: project_plural
    }, namespace, labelSelector);
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