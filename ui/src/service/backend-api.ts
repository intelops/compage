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

export const CompageBackendApi = () => {
    const path = "/compage"
    return axios.create({
        baseURL: config.backend_base_url + path,
        headers: getHeaders()
    },)
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