import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import * as fs from 'fs';
import {gitOperations} from './common';
import Logger from '../../utils/logger';
import {ExistingProjectGitServerRequest} from './models';

export const cloneExistingProjectFromGitServer = async (existingProjectGitServerRequest: ExistingProjectGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: existingProjectGitServerRequest.clonedProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // Set up GitServer url like this so no manual entry of user pass needed
    const gitServerUrl = `https://${existingProjectGitServerRequest.gitProviderDetails.platformUserName}:${existingProjectGitServerRequest.gitProviderDetails.platformPersonalAccessToken}@github.com/${existingProjectGitServerRequest.gitProviderDetails.platformUserName}/${existingProjectGitServerRequest.gitProviderDetails.repositoryName}.git`;
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

export const pushToExistingProjectOnGitServer = async (existingProjectGitServerRequest: ExistingProjectGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: existingProjectGitServerRequest.existingProject,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // add local git config like username and email
    await git.addConfig('user.email', existingProjectGitServerRequest.gitProviderDetails.platformEmail);
    await git.addConfig('user.name', existingProjectGitServerRequest.gitProviderDetails.platformUserName);

    // copy over the new files to this cloned files.
    fs.cpSync(existingProjectGitServerRequest.generatedProjectPath, existingProjectGitServerRequest.existingProject, {recursive: true});
    Logger.info(`${existingProjectGitServerRequest.generatedProjectPath} files copied to ${existingProjectGitServerRequest.existingProject}`);

    // add, commit and push
    return await gitOperations(git, existingProjectGitServerRequest.gitProviderDetails.repositoryBranch, existingProjectGitServerRequest.projectVersion);
};