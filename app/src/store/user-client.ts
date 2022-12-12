import {createObject, getObject, listObjects, patchObject} from "./kube-client";

const group = "compage.kube-tarian.github.com";
const version = "v1alpha1";
const plural = "users";

// createUserResource creates user resource
export const createUserResource = async (namespace: string, payload: string) => {
    return await createObject({group, version, plural}, namespace, payload);
}

// getUserResource gets user resource
export const getUserResource = async (namespace: string, name: string) => {
    return await getObject({group, version, plural}, namespace, name);
}

// patchUserResource patches user resource
export const patchUserResource = async (namespace: string, name: string, payload: string) => {
    return await patchObject({group, version, plural}, namespace, name, payload);
}

// listUsers lists user resource
export const listUserResources = async (namespace: string) => {
    return await listObjects({group, version, plural}, namespace);
}