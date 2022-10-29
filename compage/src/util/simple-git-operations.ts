import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';
import * as fs from "fs";

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
            console.debug('git init failed');
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
            console.debug('git remote add origin failed');
            return failure;
        });

    // Add all files for commit
    await git.add('.')
        .then(
            (success: any) => {
                console.debug("git add succeeded");
            }, (failure: any) => {
                console.debug('git add failed');
                return failure;
            });

    // Commit files as Initial Commit
    await git.commit('commit by compage : generated files through compage')
        .then(
            (success: any) => {
                console.debug('git commit succeeded');
            }, (failure: any) => {
                console.debug('git commit failed');
                return failure;
            });

    // Finally push to online repository
    await git.push('origin', 'master')
        .then((success: any) => {
            console.debug('git push succeeded');
        }, (failure: any) => {
            console.debug('git push failed');
            return failure;
        });
}

export interface CloneExistingProjectFromGithubRequest {
    clonedProjectPath: string,
    repositoryName: string,
    userName: string,
    password: string,
}

export const cloneExistingProjectFromGithub = async (cloneExistingProjectFromGithubRequest: CloneExistingProjectFromGithubRequest) => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: cloneExistingProjectFromGithubRequest.clonedProjectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // Set up GitHub url like this so no manual entry of user pass needed
    const gitHubUrl = `https://${cloneExistingProjectFromGithubRequest.userName}:${cloneExistingProjectFromGithubRequest.password}@github.com/${cloneExistingProjectFromGithubRequest.userName}/${cloneExistingProjectFromGithubRequest.repositoryName}.git`;

    // clone git repository
    await git.clone(gitHubUrl).then(
        (success: any) => {
            console.debug("git clone succeeded");
        }, (failure: any) => {
            console.debug('git clone failed');
            return failure
        });
}

export interface PushToExistingProjectOnGithubRequest {
    createdProjectPath: string,
    repositoryName: string,
    existingProject: string,
    userName: string,
    password: string,
    email: string
}

export const pushToExistingProjectOnGithub = async (pushToExistingProjectOnGithubRequest: PushToExistingProjectOnGithubRequest) => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushToExistingProjectOnGithubRequest.existingProject,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // add local git config like username and email
    await git.addConfig('user.email', pushToExistingProjectOnGithubRequest.email);
    await git.addConfig('user.name', pushToExistingProjectOnGithubRequest.userName);

    // copy over the new files to this cloned files.
    fs.cpSync(pushToExistingProjectOnGithubRequest.createdProjectPath, pushToExistingProjectOnGithubRequest.existingProject, {recursive: true})
    console.log(`${pushToExistingProjectOnGithubRequest.createdProjectPath} files copied to ${pushToExistingProjectOnGithubRequest.existingProject}`)

    // Add all files for commit
    await git.add('.')
        .then(
            (success: any) => {
                console.debug("git add succeeded");
            }, (failure: any) => {
                console.debug('git add failed');
                return failure;
            });

    // Commit files as Initial Commit
    await git.commit('commit by compage : generated files through compage')
        .then(
            (success: any) => {
                console.debug('git commit succeeded');
            }, (failure: any) => {
                console.debug('git commit failed');
                return failure;
            });

    // Finally push to online repository
    await git.push('origin', 'master')
        .then((success: any) => {
            console.debug('git push succeeded');
        }, (failure: any) => {
            console.debug('git push failed');
            return failure;
        });
}