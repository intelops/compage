import axios from 'axios';
import {config} from "./constants";
import {retrieveCurrentUserName} from "./localstorage-client";

export const X_USER_NAME_HEADER = "X-User-Name";

const BackendApi = () => {
    return axios.create({
        baseURL: config.backend_base_url,
        headers: getHeaders()
    })
}

export const AuthBackendApi = () => {
    const path = "/auth"
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    })
}

export const GithubBackendApi = () => {
    const path = "/github"
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    })
}

export const CodeOperationsBackendApi = () => {
    const path = "/code_operations"
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },)
}

export const ProjectsBackendApi = () => {
    const path = "/projects"
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },);
}

const getHeaders = () => {
    return {
        post: {
            [X_USER_NAME_HEADER]: retrieveCurrentUserName()
        },
        get: {
            [X_USER_NAME_HEADER]: retrieveCurrentUserName()
        }
    };
}