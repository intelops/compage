import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import {Repository} from '../../routes/models';
import Logger from '../logger';

export interface CloneExistingProjectFromGitServerRequest {
    clonedProjectPath: string;
    repository: Repository;
    userName: string;
    token: string;
}

export const cloneExistingProjectFromGitServer = async (cloneExistingProjectFromGitServerRequest: CloneExistingProjectFromGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: cloneExistingProjectFromGitServerRequest.clonedProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // Set up GitServer url like this so no manual entry of user pass needed
    const gitServerUrl = `https://${cloneExistingProjectFromGitServerRequest.userName}:${cloneExistingProjectFromGitServerRequest.token}@github.com/${cloneExistingProjectFromGitServerRequest.userName}/${cloneExistingProjectFromGitServerRequest.repository.name}.git`;
    let error: string = '';
    // clone git repository
    await git.clone(gitServerUrl).then(
        (success: any) => {
            Logger.debug('git clone succeeded');
        }, (failure: any) => {
            Logger.debug(`git clone failed: ${failure}`);
            error = `git clone failed: ${failure}`;
        });
    return error;
};
