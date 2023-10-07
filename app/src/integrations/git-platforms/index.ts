import {ProjectEntity} from '../../models/project';
import {createGithubRepository} from './github';
import fs from 'fs';
import {GitPlatformEntity} from '../../models/gitPlatform';
import {NewProjectGitServerRequest} from '../simple-git/models';
import {pushNewProjectToGitServer} from '../simple-git/newProject';
import {GitPlatformService} from '../../services/gitPlatformService';

const gitPlatformService = new GitPlatformService();

export const createRepository = async (projectEntity: ProjectEntity) => {
    switch (projectEntity.git_platform_name) {
        case 'github': {
            return await createGithubRepository(projectEntity);
        }
        // case 'gitlab':
        //     return await createGitlabRepository(projectEntity);
        // case 'bitbucket':
        //     return await createBitbucketRepository(projectEntity);
        default:
            throw new Error('Unsupported git platform');
    }
};

export const makeInitialCommit = async (projectEntity: ProjectEntity) => {
    const createdProjectPath = `/compage/workdir/workdir/${projectEntity.id}`;
    fs.mkdirSync(createdProjectPath, {recursive: true});
    fs.writeFileSync(`${createdProjectPath}/README.md`, `# ${projectEntity.repository_name}`);
    const gitPlatform: GitPlatformEntity = await gitPlatformService.getGitPlatform(projectEntity.owner_email, projectEntity.git_platform_name);
    const newProjectGitServerRequest: NewProjectGitServerRequest = {
        projectVersion: 'v1',
        generatedProjectPath: createdProjectPath,
        gitProviderDetails: {
            platformName: projectEntity.git_platform_name,
            platformUrl: gitPlatform.url,
            platformUserName: projectEntity.git_platform_user_name,
            platformEmail: gitPlatform.owner_email,
            platformPersonalAccessToken: gitPlatform.personal_access_token,
            repositoryBranch: projectEntity.repository_branch,
            repositoryIsPublic: projectEntity.is_repository_public,
            repositoryName: projectEntity.repository_name,
        }
    };
    const error = await pushNewProjectToGitServer(newProjectGitServerRequest);
    if (error.length !== 0) {
        throw new Error(error);
    }
    // delete the project from temp folder once it's pushed to git server.
    // fs.rmSync(createdProjectPath, {recursive: true});
};
