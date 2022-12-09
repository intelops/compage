import {simpleGit, SimpleGit, SimpleGitOptions} from "simple-git";
import {Repository} from "../../routes/models";

export interface CloneExistingProjectFromGithubRequest {
    clonedProjectPath: string,
    repository: Repository,
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
    const gitHubUrl = `https://${cloneExistingProjectFromGithubRequest.userName}:${cloneExistingProjectFromGithubRequest.password}@github.com/${cloneExistingProjectFromGithubRequest.userName}/${cloneExistingProjectFromGithubRequest.repository.name}.git`;

    // clone git repository
    await git.clone(gitHubUrl).then(
        (success: any) => {
            console.debug("git clone succeeded");
        }, (failure: any) => {
            console.debug('git clone failed : ', failure);
            return failure
        });
}
