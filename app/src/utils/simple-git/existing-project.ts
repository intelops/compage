import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import * as fs from 'fs';
import {gitOperations} from './common';
import Logger from '../logger';
import {PushToExistingProjectOnGitServerRequest} from './models';

export const pushToExistingProjectOnGitServer = async (pushToExistingProjectOnGitServerRequest: PushToExistingProjectOnGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushToExistingProjectOnGitServerRequest.existingProject,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // add local git config like username and email
    await git.addConfig('user.email', pushToExistingProjectOnGitServerRequest.gitCredentials.platformEmail);
    await git.addConfig('user.name', pushToExistingProjectOnGitServerRequest.gitCredentials.platformUserName);

    // copy over the new files to this cloned files.
    fs.cpSync(pushToExistingProjectOnGitServerRequest.generatedProjectPath, pushToExistingProjectOnGitServerRequest.existingProject, {recursive: true});
    Logger.info(`${pushToExistingProjectOnGitServerRequest.generatedProjectPath} files copied to ${pushToExistingProjectOnGitServerRequest.existingProject}`);

    // add, commit and push
    return await gitOperations(git, pushToExistingProjectOnGitServerRequest.gitCredentials.repositoryBranch, pushToExistingProjectOnGitServerRequest.projectVersion);
};