import axios from 'axios';
import {ProjectEntity} from '../../models/project';
import {GitPlatformEntity} from '../../models/gitPlatform';
import {GITHUB} from '../supportedGitPlatforms';
import {GitPlatformService} from '../../services/gitPlatformService';

const ACCEPT = `application/vnd.github+json`;
const USER_REPO_URL = `https://api.github.com/user/repos`;
const gitPlatformService = new GitPlatformService();

export const createGithubRepository = async (projectEntity: ProjectEntity) => {
    const email = projectEntity.owner_email;
    const gitPlatformEntity: GitPlatformEntity = await gitPlatformService.getGitPlatform(email, GITHUB);
    return axios({
        headers: {
            Accept: ACCEPT,
            Authorization: `Bearer ${gitPlatformEntity.personal_access_token}`,
        },
        url: USER_REPO_URL, method: 'POST', data: {
            name: projectEntity.repository_name,
            repository: projectEntity.repository_name + ' created by compage',
            private: !projectEntity.is_repository_public,
        }
    });
};
