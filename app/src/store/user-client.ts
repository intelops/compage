import {createObject, getObject, listObjects} from "./kube-client";

const group = "compage.kube-tarian.github.com";
const version = "v1alpha1";
const plural = "users";

// createUser creates user resource
export const createUser = async (namespace: string, payload: string) => {
    const result = await createObject({group, version, plural}, namespace, payload);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
}

// getUser gets user resource
export const getUser = async (name: string, namespace: string) => {
    const result = await getObject({group, version, plural}, namespace, name);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
}

// listUsers lists user resource
export const listUsers = async (namespace: string) => {
    const result = await listObjects({group, version, plural}, namespace);
    console.log(JSON.stringify(result))
    console.log("--------------------------------")
}