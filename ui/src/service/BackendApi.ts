import axios from 'axios';

let BackendBaseURL

if (process.env.NODE_ENV === 'development') {
    // export const
    BackendBaseURL = 'http://localhost:5000'
} else {
    // for container
    BackendBaseURL = 'http://compageapp:5000/'
}

const BackendApi = () => {
    return axios.create({
        baseURL: BackendBaseURL
    })
}

export const AuthBackendApi = () => {
    const path = "/auth"
    return axios.create({
        baseURL: BackendBaseURL + path
    })
}
export const GithubBackendApi = () => {
    const path = "/github"
    return axios.create({
        baseURL: BackendBaseURL + path
    })
}

export const CompageBackendApi = () => {
    const path = "/compage"
    return axios.create({
        baseURL: BackendBaseURL + path
    })
}
export default BackendBaseURL;