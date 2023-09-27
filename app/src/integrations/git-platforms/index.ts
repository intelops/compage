import {ProjectEntity} from '../../models/project';
import {createGithubRepository, createGithubRepositoryBranch} from './github';
import Logger from '../../utils/logger';

export const createRepository = async (projectEntity: ProjectEntity) => {
    switch (projectEntity.git_platform_name) {
        case 'github': {
            const createGithubRepositoryResponse = await createGithubRepository(projectEntity);
            Logger.debug(`createGithubRepositoryResponse: ${JSON.stringify(createGithubRepositoryResponse.data)}`);
            const createGithubRepositoryBranchResponse = await createGithubRepositoryBranch(projectEntity);
            Logger.debug(`createGithubRepositoryBranchResponse: ${JSON.stringify(createGithubRepositoryBranchResponse.data)}`);
            return;
        }
        // case 'gitlab':
        //     return await createGitlabRepository(projectEntity);
        // case 'bitbucket':
        //     return await createBitbucketRepository(projectEntity);
        default:
            throw new Error('Unsupported git platform');
    }
};