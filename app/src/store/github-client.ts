import axios from "axios";
import {getToken} from "../util/user-store";

const ACCEPT = `application/vnd.github+json`;
const USER_REPO_URL = `https://api.github.com/user/repos`;
const REPO_URL = `https://api.github.com/repos`;

export const createRepository = async (userName: string, repositoryName: string, description: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(userName)}`,
        },
        url: USER_REPO_URL, method: "POST", data: {
            name: repositoryName,
            description: description,
            private: true,
        }
    });
}

export const listRepositories = async (userName: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(<string>userName)}`,
        },
        url: USER_REPO_URL,
        method: "GET"
    })
}

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
        method: "PUT",
        data: {
            message: message,
            content: content,
            committer: {
                name: userName,
                email: email
            },
            sha: sha
        }
    })
}

export const pullCompageJson = async (userName: string, repositoryName: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getToken(<string>userName)}`,
        },
        url: `${REPO_URL}/${userName}/${repositoryName}/contents/.compage/config.json`,
        method: "GET",
    })
}