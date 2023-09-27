import {SimpleGit} from 'simple-git';
import Logger from '../../utils/logger';

export const gitOperations = async (git: SimpleGit, repositoryBranch?: string, projectVersion?: string): Promise<string> => {
    // Add all files for commit
    let error: string = '';
    await git.add('.')
        .then(
            (success: any) => {
                Logger.debug(`git add succeeded: ${success}`);
            }, (failure: any) => {
                Logger.debug(`git add failed: ${failure}`);
                error = `git add failed: ${failure}`;
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
                Logger.debug(`git commit succeeded: ${success}`);
            }, (failure: any) => {
                Logger.debug(`git commit failed: ${failure}`);
                error = `git commit failed: ${failure}`;
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

    if (repositoryBranch && projectVersion) {
        //  checkoutLocalBranch checks out local branch with name supplied
        await git.checkoutLocalBranch(branchName)
            .then(
                (success: any) => {
                    Logger.debug(`git checkoutLocalBranch succeeded: ${success}`);
                }, (failure: any) => {
                    Logger.debug(`git checkoutLocalBranch failed: ${failure}`);
                    error = `git checkoutLocalBranch failed: ${failure}`;
                });
        if (error.length > 0) {
            return error;
        }
    }

    // Finally push to online repository
    await git.push('origin', branchName, {'--force': null})
        .then((success: any) => {
            Logger.debug(`git push succeeded: ${success}`);
        }, (failure: any) => {
            Logger.debug(`git push failed: ${failure}`);
            error = `git push failed: ${failure}`;
        });
    return error;
};
