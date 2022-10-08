import axios from 'axios';

// proxy backend server - for now
export default () => {
    return axios.create({
        baseURL: 'http://localhost:5000/'
    })
}