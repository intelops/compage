import {simpleGit, SimpleGit, SimpleGitOptions} from "simple-git";
import {gitOperations} from "./common";
import {Repository} from "../../routes/models";
import Logger from "../logger";

export interface PushNewProjectToGitServerRequest {
    projectVersion: string;
    generatedProjectPath: string;
    repository: Repository;
    userName: string;
    password: string;
    email: string;
}

export const pushNewProjectToGitServer = async (pushNewProjectToGitServerRequest: PushNewProjectToGitServerRequest): Promise<string> => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushNewProjectToGitServerRequest.generatedProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    let error: string = "";

    // initialize git
    await git.init().then(
        (success: any) => {
            Logger.debug("git init succeeded");
        }, (failure: any) => {
            Logger.debug('git init failed : ', failure);
            error = "git init failed" + failure;
        });
    if (error.length > 0) {
        return error;
    }
    // add local git config like username and email
    await git.addConfig('user.email', pushNewProjectToGitServerRequest.email);
    await git.addConfig('user.name', pushNewProjectToGitServerRequest.userName);

    // TODO when the support for other git providers will be added, need to change below hardcoded string.
    // Set up GitHub url like this so no manual entry of user pass needed
    const gitServerUrl = `https://${pushNewProjectToGitServerRequest.userName}:${pushNewProjectToGitServerRequest.password}@github.com/${pushNewProjectToGitServerRequest.userName}/${pushNewProjectToGitServerRequest.repository.name}.git`;

    // Add remote repository url as origin to repository
    await git.addRemote('origin', gitServerUrl).then(
        (success: any) => {
            Logger.debug("git remote add origin succeeded");
        }, (failure: any) => {
            Logger.debug('git remote add origin failed : ', failure);
            error = "git remote add origin failed" + failure;
        });
    if (error.length > 0) {
        return error;
    }

    // add, commit and push
    return await gitOperations(git, pushNewProjectToGitServerRequest.repository, pushNewProjectToGitServerRequest.projectVersion);
}