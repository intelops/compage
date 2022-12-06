import {simpleGit, SimpleGit, SimpleGitOptions} from "simple-git";
import {gitOperations} from "./common";

export interface PushNewProjectToGithubRequest {
    createdProjectPath: string,
    repositoryName: string,
    userName: string,
    password: string,
    email: string
}

export const pushNewProjectToGithub = async (pushNewProjectToGithubRequest: PushNewProjectToGithubRequest) => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushNewProjectToGithubRequest.createdProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // initialize git
    await git.init().then(
        (success: any) => {
            console.debug("git init succeeded");
        }, (failure: any) => {
            console.debug('git init failed : ', failure);
            return failure
        });

    // add local git config like username and email
    await git.addConfig('user.email', pushNewProjectToGithubRequest.email);
    await git.addConfig('user.name', pushNewProjectToGithubRequest.userName);

    // Set up GitHub url like this so no manual entry of user pass needed
    const gitHubUrl = `https://${pushNewProjectToGithubRequest.userName}:${pushNewProjectToGithubRequest.password}@github.com/${pushNewProjectToGithubRequest.userName}/${pushNewProjectToGithubRequest.repositoryName}.git`;

    // Add remote repository url as origin to repository
    await git.addRemote('origin', gitHubUrl).then(
        (success: any) => {
            console.debug("git remote add origin succeeded");
        }, (failure: any) => {
            console.debug('git remote add origin failed : ', failure);
            return failure;
        });

    // add, commit and push
    await gitOperations(git)
}