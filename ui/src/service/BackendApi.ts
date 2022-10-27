import axios from 'axios';
// for local development
export const BackendBaseURL = 'http://localhost:5000/'
// for container
// export const BackendBaseURL = 'http://compageapp:5000/'
// proxy backend server - for now
export default () => {
    return axios.create({
        baseURL: BackendBaseURL
    })
}