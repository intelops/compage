import {createObject, getObject, listObjects, patchObject} from "./kube-client";
import {user_group, user_plural, user_version, UserResource} from "./models";


// createUserResource creates user resource
export const createUserResource = async (namespace: string, payload: string) => {
    const object = await createObject({
        group: user_group,
        version: user_version,
        plural: user_plural
    }, namespace, payload);
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
}

// getUserResource gets user resource
export const getUserResource = async (namespace: string, name: string) => {
    const object = await getObject({group: user_group, version: user_version, plural: user_plural}, namespace, name);
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
}

// patchUserResource patches user resource
export const patchUserResource = async (namespace: string, name: string, payload: string) => {
    const patch = [{
        "op": "replace",
        "path":"/spec",
        "value": JSON.parse(payload)
    }];

    const object = await patchObject({
        group: user_group,
        version: user_version,
        plural: user_plural
    }, namespace, name, JSON.stringify(patch));
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
}

// listUsers lists user resource
export const listUserResources = async (namespace: string) => {
    const objects = await listObjects({group: user_group, version: user_version, plural: user_plural}, namespace);
    const userResources: UserResource[] = [];
    for (let i = 0; i < objects.items.length; i++) {
        let uR = objects.items[i];
        const userResource: UserResource = {
            kind: uR.kind,
            apiVersion: uR.apiVersion,
            spec: uR.spec,
            metadata: uR.metadata
        };
        userResources.push(userResource);
    }
    return userResources;
}