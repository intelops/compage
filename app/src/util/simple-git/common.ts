import {SimpleGit} from "simple-git";
import {Repository} from "../../routes/models";

export const gitOperations = async (git: SimpleGit, repository: Repository): Promise<string> => {
    // Add all files for commit
    let error: string = ""
    await git.add('.')
        .then(
            (success: any) => {
                console.debug("git add succeeded");
            }, (failure: any) => {
                console.debug('git add failed : ', failure);
                error = "git add failed" + failure
            });
    if (error.length > 0) {
        return error
    }

    // Commit files as Initial Commit
    await git.commit('commit by compage : generated files through compage')
        .then(
            (success: any) => {
                console.debug('git commit succeeded');
            }, (failure: any) => {
                console.debug('git commit failed : ', failure);
                error = "git commit failed" + failure
            });
    if (error.length > 0) {
        return error
    }

    //  checkoutLocalBranch checks out local branch with name supplied
    await git.checkoutLocalBranch(repository.branch)
        .then(
            (success: any) => {
                console.debug('git checkoutLocalBranch succeeded');
            }, (failure: any) => {
                console.debug('git checkoutLocalBranch failed : ', failure);
                error = "git checkoutLocalBranch failed" + failure
            });
    if (error.length > 0) {
        return error
    }

    // Finally push to online repository
    await git.push('origin', repository.branch, { '--force': null })
        .then((success: any) => {
            console.debug('git push succeeded');
        }, (failure: any) => {
            console.debug('git push failed : ', failure);
            error = "git push failed" + failure
        });
    return error
}
