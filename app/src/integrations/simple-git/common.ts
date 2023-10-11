import {SimpleGit} from 'simple-git';
import Logger from '../../utils/logger';

export const gitOperations = async (git: SimpleGit, repositoryBranch?: string, projectVersion?: string): Promise<string> => {
    // Add all files for commit
    let error: string = '';
    await git.add('.')
        .then(
            (success: any) => {
                Logger.debug(`git add succeeded: ${JSON.stringify(success)}`);
            }, (failure: any) => {
                Logger.debug(`git add failed: ${JSON.stringify(failure)}`);
                error = `git add failed: ${JSON.stringify(failure)}`;
            });
    if (error.length > 0) {
        return error;
    }

    let message: string = '';
    if (!repositoryBranch && !projectVersion) {
        message = 'Initial Commit';
    } else {
        message = `commit by compage : generated files through compage for version: ${projectVersion}`;
    }
    // Commit files
    await git.commit(message)
        .then(
            (success: any) => {
                Logger.debug(`git commit succeeded: ${JSON.stringify(success)}`);
            }, (failure: any) => {
                Logger.debug(`git commit failed: ${JSON.stringify(failure)}`);
                error = `git commit failed: ${JSON.stringify(failure)}`;
            });
    if (error.length > 0) {
        return error;
    }

    let branchName: string = '';
    if (!repositoryBranch && !projectVersion) {
        branchName = 'main';
    } else {
        branchName = repositoryBranch + '-' + projectVersion;
    }

    //  checkoutLocalBranch checks out local branch with name supplied
    await git.checkoutLocalBranch(branchName)
        .then(
            (success: any) => {
                Logger.debug(`git checkoutLocalBranch succeeded: ${JSON.stringify(success)}`);
            }, (failure: any) => {
                Logger.debug(`git checkoutLocalBranch failed: ${JSON.stringify(failure)}`);
                error = `git checkoutLocalBranch failed: ${JSON.stringify(failure)}`;
            });
    if (error.length > 0) {
        return error;
    }

    // Finally, push to online repository
    await git.push('origin', branchName, {'--force': null})
        .then((success: any) => {
            Logger.debug(`git push succeeded: ${JSON.stringify(success)}`);
        }, (failure: any) => {
            Logger.debug(`git push failed: ${JSON.stringify(failure)}`);
            error = `git push failed: ${JSON.stringify(failure)}`;
        });
    return error;
};
