import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';

export interface PushProjectToGithubRequest {
    projectPath: string,
    repositoryName: string,
    userName: string,
    password: string,
    email: string
}

export const pushProjectToGithub = (pushProjectToGithubRequest: PushProjectToGithubRequest) => {
    const options: Partial<SimpleGitOptions> = {
        baseDir: pushProjectToGithubRequest.projectPath,
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    // Set up GitHub url like this so no manual entry of user pass needed
    const gitHubUrl = `https://${pushProjectToGithubRequest.userName}:${pushProjectToGithubRequest.password}@github.com/${pushProjectToGithubRequest.userName}/${pushProjectToGithubRequest.repositoryName}.git`;

    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // add local git config like username and email
    git.addConfig('user.email', pushProjectToGithubRequest.email);
    git.addConfig('user.name', pushProjectToGithubRequest.userName);
    // Add remote repository url as origin to repository
    git.addRemote('origin', gitHubUrl);
    // Add all files for commit
    git.add('.')
        .then(
            (success: any) => {
                console.debug("git add succeeded");
            }, (failure: any) => {
                console.debug('git add failed');
                return failure
            });
    // Commit files as Initial Commit
    git.commit('commit by compage : generated files through compage')
        .then(
            (success: any) => {
                console.debug('git commit succeeded');
            }, (failure: any) => {
                console.debug('git commit failed');
                return failure
            });
    // Finally push to online repository
    git.push('origin', 'main')
        .then((success: any) => {
            console.debug('git push succeeded');
        }, (failure: any) => {
            console.debug('git push failed');
            return failure
        });
}