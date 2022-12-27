import axios from "axios";
import {getToken} from "../util/user-store";

export const createRepository = async (userName: string, repositoryName: string, description: string) => {
    return axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${await getToken(userName)}`,
        },
        url: `https://api.github.com/user/repos`, method: "POST", data: {
            name: repositoryName,
            description: description,
            private: true,
        }
    });
}

export const listRepositories = async (userName: string) => {
    return axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${await getToken(<string>userName)}`,
        },
        url: `https://api.github.com/user/repos`,
        method: "GET"
    })
}

export const commitCompageYaml = async (userName: string,
                                        email: string,
                                        repositoryName: string,
                                        content: string,
                                        message: string,
                                        sha: string) => {
    return axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${await getToken(userName)}`,
        },
        url: `https://api.github.com/repos/${userName}/${repositoryName}/contents/.compage/config.json`,
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

export const pullCompageYaml = async (userName: string, repositoryName: string) => {
    return axios({
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${await getToken(<string>userName)}`,
        },
        url: `https://api.github.com/repos/${userName}/${repositoryName}/contents/.compage/config.json`,
        method: "GET",
    })
}