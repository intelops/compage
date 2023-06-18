import axios from 'axios';
import {getToken} from './user-client';

const ACCEPT = `application/vnd.github+json`;
const USER_REPO_URL = `https://api.github.com/user/repos`;
const REPO_URL = `https://api.github.com/repos`;

export const createRepository = async (userName: string, repositoryName: string, description: string, isPublic: boolean) => {
    console.log("isPublic : ", isPublic);
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(userName)}`,
        },
        url: USER_REPO_URL, method: 'POST', data: {
            name: repositoryName,
            description,
            private: !isPublic,
        }
    });
};

export const listRepositories = async (userName: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(userName as string)}`,
        },
        url: USER_REPO_URL,
        method: 'GET'
    });
};

export const commitCompageJson = async (userName: string,
                                        email: string,
                                        repositoryName: string,
                                        content: string,
                                        message: string,
                                        sha: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(userName)}`,
        },
        url: `${REPO_URL}/${userName}/${repositoryName}/contents/.compage/config.json`,
        method: 'PUT',
        data: {
            message,
            content,
            committer: {
                name: userName,
                email
            },
            sha
        }
    });
};

export const pullCompageJson = async (userName: string, repositoryName: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(userName as string)}`,
        },
        url: `${REPO_URL}/${userName}/${repositoryName}/contents/.compage/config.json`,
        method: 'GET',
    });
};