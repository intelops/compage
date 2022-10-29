import {simpleGit, SimpleGit, SimpleGitOptions} from 'simple-git';

const options: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const shell = require('shelljs');

const saveProjectToGithub = () => {
    // change current directory to repository directory in local
    shell.cd('/tmp/first-project');
    console.log(shell.pwd())
    // repository name
    const repositoryName = 'first-project';
    // Username and password of your GitHub
    const userName = 'mahendraintelops';
    const password = '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';

    // Set up GitHub url like this so no manual entry of user pass needed
    const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repositoryName}.git`;
    console.log(gitHubUrl)
    // when setting all options in a single object
    const git: SimpleGit = simpleGit(options);

    // add local git config like username and email
    git.addConfig('user.email', 'mahendraintelops@intelops.dev');
    git.addConfig('user.name', 'Mahendra');
    // Add remote repository url as origin to repository
    git.addRemote('origin', gitHubUrl);
    // Add all files for commit
    git.add('.')
        .then(
            (addSuccess: any) => {
                console.log(addSuccess);
            }, (failedAdd: any) => {
                console.log('adding files failed');
            });
    // Commit files as Initial Commit
    git.commit('Initial commit by simplegit')
        .then(
            (successCommit: any) => {
                console.log(successCommit);
            }, (failed: any) => {
                console.log('failed to commit');
            });
    // Finally push to online repository
    git.push('origin', 'main')
        .then((success: any) => {
            console.log('repository push succeeded');
        }, (failed: any) => {
            console.log('repository push failed');
        });
}
saveProjectToGithub()