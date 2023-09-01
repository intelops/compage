import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import {gitOperations} from './common';
import Logger from '../logger';
import {PushNewProjectToGitServerRequest} from './models';

export const pushNewProjectToGitServer = async (pushNewProjectToGitServerRequest: PushNewProjectToGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushNewProjectToGitServerRequest.generatedProjectPath,
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
            Logger.debug(`git init succeeded: ${success}`);
        }, (failure: any) => {
            Logger.debug(`git init failed: ${failure}`);
            error = `git init failed: ${failure}`;
        });
    if (error.length > 0) {
        return error;
    }
    // add local git config like username and email
    await git.addConfig('user.email', pushNewProjectToGitServerRequest.gitCredentials.platformEmail);
    await git.addConfig('user.name', pushNewProjectToGitServerRequest.gitCredentials.platformUserName);

    // TODO when the support for other git providers will be added, need to change below hardcoded string.
    // Set up GitHub url like this so no manual entry of user pass needed
    const gitServerUrl = `https://${pushNewProjectToGitServerRequest.gitCredentials.platformUserName}:${pushNewProjectToGitServerRequest.gitCredentials.platformPassword}@${pushNewProjectToGitServerRequest.gitCredentials.platformUrl}/${pushNewProjectToGitServerRequest.gitCredentials.platformUserName}/${pushNewProjectToGitServerRequest.gitCredentials.repositoryName}.git`;

    // Add remote repository url as origin to repository
    await git.addRemote('origin', gitServerUrl).then(
        (success: any) => {
            Logger.debug(`git remote add origin succeeded: ${success}`);
        }, (failure: any) => {
            Logger.debug(`git remote add origin failed: ${failure}`);
            error = `git remote add origin failed: ${failure}`;
        });
    if (error.length > 0) {
        return error;
    }

    // add, commit and push
    return await gitOperations(git, pushNewProjectToGitServerRequest.gitCredentials.repositoryBranch, pushNewProjectToGitServerRequest.projectVersion);
};