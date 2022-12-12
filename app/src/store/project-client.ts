import {createObject, getObject, listObjects, patchObject} from "./kube-client";

const group = "compage.kube-tarian.github.com";
const version = "v1alpha1";
const plural = "projects";

// createProject creates project resource
export const createProject = async (namespace: string, payload: string) => {
    const result = await createObject({group, version, plural}, namespace, payload);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
}

// getProject gets project resource
export const getProject = async (namespace: string, name: string) => {
    const result = await getObject({group, version, plural}, namespace, name);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
    return ""
}

// patchProject patches project resource
export const patchProject = async (namespace: string, name: string, payload: string) => {
    const result = await patchObject({group, version, plural}, namespace, name, payload);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
    return ""
}

// listProjects lists project resources
export const listProjects = async (namespace: string, userName: string) => {
    const result = await listObjects({group, version, plural}, namespace, userName);
    console.log(JSON.stringify(result))
    return ""
}