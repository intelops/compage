import axios from 'axios';
import {config} from "../utils/constants";

const BackendApi = () => {
    return axios.create({
        baseURL: config.backend_base_url
    })
}

export const AuthBackendApi = () => {
    const path = "/auth"
    return axios.create({
        baseURL: config.backend_base_url + path
    })
}
export const GithubBackendApi = () => {
    const path = "/github"
    return axios.create({
        baseURL: config.backend_base_url + path
    })
}

export const CompageBackendApi = () => {
    const path = "/compage"
    return axios.create({
        baseURL: config.backend_base_url + path
    })
}