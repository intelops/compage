import {CustomObjectsApi, KubeConfig} from "@kubernetes/client-node";
import {client} from "../app";

export const initializeKubeClient = () => {
    const kubeConfig = new KubeConfig();
    if (process.env.NODE_ENV === 'development') {
        kubeConfig.loadFromDefault();
    } else {
        kubeConfig.loadFromCluster();
    }
    return kubeConfig.makeApiClient(CustomObjectsApi);
}

export const getObject = async ({
                                    group,
                                    version,
                                    plural
                                }: { group: string, version: string, plural: string }
    , namespace: string, name: string) => {
    return await client.getNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        name
    );
}

export const createObject = async ({
                                       group,
                                       version,
                                       plural
                                   }: { group: string, version: string, plural: string }
    , namespace: string, payload: string) => {
    return await client.createNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
        JSON.parse(payload)
    );
}

export const listObjects = async ({
                                      group,
                                      version,
                                      plural
                                  }: { group: string, version: string, plural: string }
    , namespace: string) => {
    return await client.listNamespacedCustomObject(
        group,
        version,
        namespace,
        plural,
    );
}