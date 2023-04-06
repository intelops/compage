import {createObject, deleteObject, getObject, listObjects, patchObject} from './kube-client';
import {PROJECT_GROUP, PROJECT_PLURAL, PROJECT_VERSION, ProjectResource, Resource} from './models';

// createProjectResource creates project resource
export const createProjectResource = async (namespace: string, payload: string) => {
    const object = await createObject({
        group: PROJECT_GROUP,
        version: PROJECT_VERSION,
        plural: PROJECT_PLURAL
    }, namespace, payload);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
};

// patchProjectResource patches project resource
export const patchProjectResource = async (namespace: string, name: string, payload: string) => {
    const patch = [{
        'op': 'replace',
        'path': '/spec',
        'value': JSON.parse(payload)
    }];

    const object = await patchObject({
        group: PROJECT_GROUP,
        version: PROJECT_VERSION,
        plural: PROJECT_PLURAL
    }, namespace, name, JSON.stringify(patch));
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
};

// deleteProjectResource deletes user resource
export const deleteProjectResource = async (namespace: string, projectId: string) => {
    await deleteObject({
        group: PROJECT_GROUP,
        version: PROJECT_VERSION,
        plural: PROJECT_PLURAL
    }, namespace, projectId);
};

// getProjectResource gets user resource
export const getProjectResource = async (namespace: string, projectId: string) => {
    const object: Resource = await getObject({
        group: PROJECT_GROUP,
        version: PROJECT_VERSION,
        plural: PROJECT_PLURAL
    }, namespace, projectId);
    const projectResource: ProjectResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return projectResource;
};

// listProjectResources lists project resources
export const listProjectResources = async (namespace: string, labelSelector: string) => {
    const objects = await listObjects({
        group: PROJECT_GROUP,
        version: PROJECT_VERSION,
        plural: PROJECT_PLURAL
    }, namespace, labelSelector);
    const projectResources: ProjectResource[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < objects.items.length; i++) {
        const uR = objects.items[i];
        const projectResource: ProjectResource = {
            kind: uR.kind,
            apiVersion: uR.apiVersion,
            spec: uR.spec,
            metadata: uR.metadata
        };
        projectResources.push(projectResource);
    }
    return projectResources;
};