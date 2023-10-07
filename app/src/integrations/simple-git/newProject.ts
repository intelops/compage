import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import {gitOperations} from './common';
import Logger from '../../utils/logger';
import {NewProjectGitServerRequest} from './models';

export const pushNewProjectToGitServer = async (newProjectGitServerRequest: NewProjectGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: newProjectGitServerRequest.generatedProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    let error: string = '';

    // initialize git
    await git.init().then(
        (success: any) => {
            Logger.debug(`git init succeeded: ${JSON.stringify(success)}`);
        }, (failure: any) => {
            Logger.debug(`git init failed: ${JSON.stringify(failure)}`);
            error = `git init failed: ${JSON.stringify(failure)}`;
        });
    if (error.length > 0) {
        return error;
    }
    Logger.debug('git init done');

    // add local git config like username and email
    await git.addConfig('user.email', newProjectGitServerRequest.gitProviderDetails.platformEmail);
    await git.addConfig('user.name', newProjectGitServerRequest.gitProviderDetails.platformUserName);

    // Set up GitHub url like this so no manual entry of user pass needed
    const gitServerUrl = `https://${newProjectGitServerRequest.gitProviderDetails.platformUserName}:${newProjectGitServerRequest.gitProviderDetails.platformPersonalAccessToken}@${newProjectGitServerRequest.gitProviderDetails.platformUrl.replace('https://', '')}/${newProjectGitServerRequest.gitProviderDetails.platformUserName}/${newProjectGitServerRequest.gitProviderDetails.repositoryName}.git`;

    // Add remote repository url as origin to repository
    await git.addRemote('origin', gitServerUrl).then(
        (success: any) => {
            Logger.debug(`git remote add origin succeeded: ${JSON.stringify(success)}`);
        }, (failure: any) => {
            Logger.debug(`git remote add origin failed: ${JSON.stringify(failure)}`);
            error = `git remote add origin failed: ${JSON.stringify(failure)}`;
        });
    if (error.length > 0) {
        return error;
    }

    // add, commit and push
    // default branch is main
    return await gitOperations(git);
};