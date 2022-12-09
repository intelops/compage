import axios from 'axios';
import {config} from "../utils/constants";

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
            "X-User-Name": retrieveCurrentUserName()
        },
        get: {
            "X-User-Name": retrieveCurrentUserName()
        }
    };
}

const retrieveCurrentUserName = () => {
    return localStorage.getItem("CURRENT_USER_NAME")
}