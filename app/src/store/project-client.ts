import {createObject, getObject, listObjects, patchObject} from "./kube-client";

const group = "compage.kube-tarian.github.com";
const version = "v1alpha1";
const plural = "projects";

// createProjectResource creates project resource
export const createProjectResource = async (namespace: string, payload: string) => {
    return await createObject({group, version, plural}, namespace, payload);
}

// patchProjectResource patches project resource
export const patchProjectResource = async (namespace: string, name: string, payload: string) => {
    return await patchObject({group, version, plural}, namespace, name, payload)
}

// getProjectResource gets user resource
export const getProjectResource = async (namespace: string, name: string) => {
    return await getObject({group, version, plural}, namespace, name);
}

// listProjectResources lists project resources
export const listProjectResources = async (namespace: string, userName: string) => {
    return await listObjects({group, version, plural}, namespace, userName);
}