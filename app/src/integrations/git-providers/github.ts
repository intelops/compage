import axios from 'axios';
import {getGitPlatformToken} from '../../utils/user-client';
import {GITHUB} from '../../utils/supportedPlatforms';
import {ProjectEntity} from '../../routes/models';

const ACCEPT = `application/vnd.github+json`;
const USER_REPO_URL = `https://api.github.com/user/repos`;
const REPO_URL = `https://api.github.com/repos`;

export const createRepository = async (projectEntity: ProjectEntity) => {
    const email = projectEntity.ownerEmail;
    const repository = projectEntity.repository;
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getGitPlatformToken(email, GITHUB)}`,
        },
        url: USER_REPO_URL, method: 'POST', data: {
            name: repository.name,
            repository: repository.name + ' created by compage',
            private: !repository.isPublic,
        }
    });
};

export const listRepositories = async (email: string) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getGitPlatformToken(email as string, GITHUB)}`,
        },
        url: USER_REPO_URL,
        method: 'GET'
    });
};

export const commitCompageJson = async (
    projectEntity: ProjectEntity,
    message: string,
    sha: string) => {

    // base64 the json as it's required for GitHub api.
    const buffer = Buffer.from(JSON.stringify(projectEntity.json));
    const base64Json = buffer.toString('base64');

    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getGitPlatformToken(projectEntity.ownerEmail, GITHUB)}`,
        },
        url: `${REPO_URL}/${projectEntity.repository.gitPlatformUserName}/${projectEntity.repository.name}/contents/.compage/config.json`,
        method: 'PUT',
        data: {
            message,
            base64Json,
            committer: {
                name: projectEntity.repository.gitPlatformUserName,
                email: projectEntity.ownerEmail,
            },
            sha
        }
    });
};

export const pullCompageJson = async (projectEntity: ProjectEntity) => {
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${await getGitPlatformToken(projectEntity.ownerEmail, GITHUB)}`,
        },
        url: `${REPO_URL}/${projectEntity.repository.gitPlatformUserName}/${projectEntity.repository.name}/contents/.compage/config.json`,
        method: 'GET',
    });
};