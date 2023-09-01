import axios from 'axios';
import {config} from "./constants";
import {getCurrentUserName} from "./sessionstorage-client";

export const X_EMAIL_HEADER = "X-Email-ID";

export const sanitizeString = (input: string) => {
    return input.split(" ").join("_");
};

export const K8sOperationsBackendApi = () => {
    const path = "/k8s";
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    });
};

export const GitPlatformBackendApi = () => {
    const path = "/git-platforms";
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    });
};

export const CodeOperationsBackendApi = () => {
    const path = "/code";
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },);
};

export const OpenApiYamlOperationsBackendApi = () => {
    const path = "/openapi";
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },);
};

export const ProjectsBackendApi = () => {
    const path = "/projects";
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },);
};

const getHeaders = () => {
    return {
        post: {
            [X_EMAIL_ID_HEADER]: getCurrentUserName()
        },
        get: {
            [X_EMAIL_ID_HEADER]: getCurrentUserName()
        },
        put: {
            [X_EMAIL_ID_HEADER]: getCurrentUserName()
        }
    };
};