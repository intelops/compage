import {SimpleGit} from "simple-git";
import {Repository} from "../../routes/models";
import Logger from "../logger";

export const gitOperations = async (git: SimpleGit, repository: Repository, projectVersion: string): Promise<string> => {
    // Add all files for commit
    let error: string = ""
    await git.add('.')
        .then(
            (success: any) => {
                Logger.debug("git add succeeded");
            }, (failure: any) => {
                Logger.debug('git add failed : ', failure);
                error = "git add failed" + failure;
            });
    if (error.length > 0) {
        return error;
    }

    // Commit files as Initial Commit
    await git.commit(`commit by compage : generated files through compage for version: ${projectVersion}`)
        .then(
            (success: any) => {
                Logger.debug('git commit succeeded');
            }, (failure: any) => {
                Logger.debug('git commit failed : ', failure);
                error = "git commit failed" + failure;
            });
    if (error.length > 0) {
        return error;
    }

    //  checkoutLocalBranch checks out local branch with name supplied
    await git.checkoutLocalBranch(repository.branch + "-" + projectVersion)
        .then(
            (success: any) => {
                Logger.debug('git checkoutLocalBranch succeeded');
            }, (failure: any) => {
                Logger.debug('git checkoutLocalBranch failed : ', failure);
                error = "git checkoutLocalBranch failed" + failure;
            });
    if (error.length > 0) {
        return error;
    }

    // Finally push to online repository
    await git.push('origin', repository.branch + "-" + projectVersion, {'--force': null})
        .then((success: any) => {
            Logger.debug('git push succeeded');
        }, (failure: any) => {
            Logger.debug('git push failed : ', failure);
            error = "git push failed" + failure;
        });
    return error;
}
