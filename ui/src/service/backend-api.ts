import axios from 'axios';
import {config} from "../utils/constants";

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
    const projectsBackendApiClient = axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },);

    // we intercept every requests
    projectsBackendApiClient.interceptors.request.use(async (cnf) => {
        // anything you want to attach to the requests such as token
        return cnf;
    }, error => {
        return Promise.reject(error)
    })

// we intercept every response
    projectsBackendApiClient.interceptors.request.use(async (cnf) => {

        return cnf;
    }, error => {
// check for authentication or anything like that
        return Promise.reject(error)
    })
    return projectsBackendApiClient;
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

const retrieveCurrentUserName = () => {
    return localStorage.getItem("CURRENT_USER_NAME")
}