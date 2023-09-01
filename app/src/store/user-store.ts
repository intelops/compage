import {createObject, getObject, listObjects, patchObject} from './kube-client';
import {USER_GROUP, USER_PLURAL, USER_VERSION, UserResource} from './models';

// createUserResource creates user resource
export const createUserResource = async (namespace: string, payload: string) => {
    const object = await createObject({
        group: USER_GROUP,
        version: USER_VERSION,
        plural: USER_PLURAL
    }, namespace, payload);
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
};

// getUserResource gets user resource
export const getUserResource = async (namespace: string, name: string) => {
    const object = await getObject({group: USER_GROUP, version: USER_VERSION, plural: USER_PLURAL}, namespace, name);
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
};

// patchUserResource patches user resource
export const patchUserResource = async (namespace: string, name: string, payload: string) => {
    const patch = [{
        'op': 'replace',
        'path': '/spec',
        'value': JSON.parse(payload)
    }];

    const object = await patchObject({
        group: USER_GROUP,
        version: USER_VERSION,
        plural: USER_PLURAL
    }, namespace, name, JSON.stringify(patch));
    const userResource: UserResource = {
        kind: object.kind,
        apiVersion: object.apiVersion,
        spec: object.spec,
        metadata: object.metadata
    };
    return userResource;
};

// listUsers lists user resource
export const listUserResources = async (namespace: string, labelSelector: string) => {
    const objects = await listObjects({
        group: USER_GROUP,
        version: USER_VERSION,
        plural: USER_PLURAL
    }, namespace, labelSelector);
    const userResources: UserResource[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < objects.items.length; i++) {
        const uR = objects.items[i];
        const userResource: UserResource = {
            kind: uR.kind,
            apiVersion: uR.apiVersion,
            spec: uR.spec,
            metadata: uR.metadata
        };
        userResources.push(userResource);
    }
    return userResources;
};