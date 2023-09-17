import * as k8s from '@kubernetes/client-node';

import {currentContext, customObjectsApiClient} from '../app';
import Logger from '../utils/logger';
import {DEVELOPMENT} from '../utils/constants';

export interface Resource {
    apiVersion: string;
    kind: string;
    metadata: any;
    spec: any;
}

export interface ResourceList {
    apiVersion: string;
    kind: string;
    metadata: any;
    items: Resource[];
}

export const initializeKubeClient = () => {
    const kubeConfig = new k8s.KubeConfig();
    if (process.env.NODE_ENV === DEVELOPMENT) {
        kubeConfig.loadFromDefault();
    } else {
        kubeConfig.loadFromCluster();
    }
    return {
        customObjectsApiClient: kubeConfig.makeApiClient(k8s.CustomObjectsApi),
        coreV1ApiClient: kubeConfig.makeApiClient(k8s.CoreV1Api),
        currentContext: kubeConfig.currentContext
    };
};

export const deleteObject = async ({
                                       group,
                                       version,
                                       plural
                                   }: { group: string, version: string, plural: string }
    , namespace: string, name: string) => {
    try {
        await customObjectsApiClient.deleteNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name
        );
    } catch (e: any) {
        Logger.debug(`error while deleting custom object: ${JSON.stringify(e?.body)}`);
        // Logger.info('error while getting custom object: ', e?.body?.reason)
    }
};

export const getObject = async ({
                                    group,
                                    version,
                                    plural
                                }: { group: string, version: string, plural: string }
    , namespace: string, name: string) => {
    try {
        const object = await customObjectsApiClient.getNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name
        );
        const resource: Resource = JSON.parse(JSON.stringify(object.body));
        return resource;
    } catch (e: any) {
        Logger.debug(`error while getting custom object: ${JSON.stringify(e?.body)}`);
        // Logger.info('error while getting custom object: ', e?.body?.reason)
        const resource: Resource = {apiVersion: '', kind: '', metadata: undefined, spec: undefined};
        return resource;
    }
};

export const patchObject = async ({
                                      group,
                                      version,
                                      plural
                                  }: { group: string, version: string, plural: string }
    , namespace: string, name: string, patch: string) => {
    const options = {'headers': {'Content-type': k8s.PatchUtils.PATCH_FORMAT_JSON_PATCH}};
    try {
        const object = await customObjectsApiClient.patchNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            name,
            JSON.parse(patch), undefined, undefined, undefined, options
        );
        const resource: Resource = JSON.parse(JSON.stringify(object.body));
        return resource;
    } catch (e: any) {
        Logger.debug(`error while patching custom object: ${JSON.stringify(e?.body)}`);
        // Logger.info(`error while patching custom object: ${e?.body?.reason}`);
        const resource: Resource = {apiVersion: '', kind: '', metadata: undefined, spec: undefined};
        return resource;
    }
};

export const createObject = async ({
                                       group,
                                       version,
                                       plural
                                   }: { group: string, version: string, plural: string }
    , namespace: string, payload: string) => {
    try {
        const object = await customObjectsApiClient.createNamespacedCustomObject(
            group,
            version,
            namespace,
            plural,
            JSON.parse(payload)
        );
        const resource: Resource = JSON.parse(JSON.stringify(object.body));
        return resource;
    } catch (e: any) {
        Logger.debug(`error while creating custom object: ${e}`);
        // Logger.info(`error while creating custom object: ${e?.body?.reason}`);
        const resource: Resource = {apiVersion: '', kind: '', metadata: undefined, spec: undefined};
        return resource;
    }
};

export const listObjects = async ({
                                      group,
                                      version,
                                      plural
                                  }: { group: string, version: string, plural: string }
    , namespace: string, labelSelector?: string) => {
    if (labelSelector) {
        try {
            const object = await customObjectsApiClient.listNamespacedCustomObject(
                group,
                version,
                namespace,
                plural,
                'true',
                false,
                '',
                '',
                labelSelector
            );

            const resources: ResourceList = JSON.parse(JSON.stringify(object.body));
            return resources;
        } catch (e: any) {
            Logger.debug(`error while listing custom object: ${JSON.stringify(e?.body)}`);
            // Logger.info(`error while listing custom object: ${e?.body?.reason}`)
            const resources: ResourceList = {apiVersion: '', items: [], kind: '', metadata: undefined};
            return resources;
        }
    } else {
        try {
            const object = await customObjectsApiClient.listNamespacedCustomObject(
                group,
                version,
                namespace,
                plural,
            );
            const resources: ResourceList = JSON.parse(JSON.stringify(object.body));
            return resources;
        } catch (e: any) {
            Logger.debug(`error while listing custom object: ${JSON.stringify(e?.body)}`);
            // Logger.info(`error while listing custom object: ${e?.body?.reason}`);
            const resources: ResourceList = {apiVersion: '', items: [], kind: '', metadata: undefined};
            return resources;
        }
    }
};

export const getCurrentContext = async () => {
    try {
        return currentContext;
    } catch (e: any) {
        Logger.debug(`error while retrieving context[${JSON.stringify(e?.body)}]`);
        throw e;
    }
};