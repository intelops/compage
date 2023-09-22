import {ProjectEntity} from '../../models/project';
import {createGithubRepository} from './github';

export const createRepository = async (projectEntity: ProjectEntity) => {
    switch (projectEntity.git_platform_name) {
        case 'github':
            return await createGithubRepository(projectEntity);
        // case 'gitlab':
        //     return await createGitlabRepository(projectEntity);
        // case 'bitbucket':
        //     return await createBitbucketRepository(projectEntity);
        default:
            throw new Error('Unsupported git platform');
    }
};