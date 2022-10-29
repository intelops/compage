import {SimpleGit} from "simple-git";

export const gitOperations = async (git: SimpleGit) => {
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
