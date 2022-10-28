import {getCurrentRepoDetails} from "../utils/service";
import {getBase64EncodedStringForConfig} from "../components/diagram-maker/helper/helper";
import {config} from "../utils/constants";

export const pullChanges = (userName: string, repoName: string): Promise<Response> => {
    const proxy_url_pull_changes = config.proxy_url_pull_changes + "?userName=" + userName + "&repoName=" + (repoName || getCurrentRepoDetails().repoName);
    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_pull_changes, {
        method: "GET",
    }).then(data => data.json());
}
export const commitChanges = (userName: string, userEmail: string, message: string): Promise<Response> => {
    const requestBody = {
        message: message,
        committer: {
            userName: userName,
            email: userEmail
        },
        content: getBase64EncodedStringForConfig(),
        sha: getCurrentRepoDetails().details.sha,
        repoName: getCurrentRepoDetails().repoName
    };
    const proxy_url_commit_changes = config.proxy_url_commit_changes;

    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_commit_changes, {
        method: "PUT",
        body: JSON.stringify(requestBody)
    }).then(data => data.json());
}
export const createRepo = (userName: string, repoName: string, repoDescription: string): Promise<Response> => {
    const requestBody = {
        repoName: repoName, description: repoDescription, userName: userName
    };

    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(config.proxy_url_create_repo, {
        method: "POST",
        body: JSON.stringify(requestBody)
    }).then(data => data.json());
}
export const generateProject = (userName: string, repoName: string, projectName: string, yaml: string):
    Promise<Response> => {
    const requestBody = {
        repoName: repoName, projectName: projectName, userName: userName, yaml: yaml
    };
    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(config.proxy_url_create_project, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    }).then(data => data.json());
}
export const listRepos = (userName: string) => {
    const proxy_url_list_repos = config.proxy_url_list_repos + "?userName=" + userName
    return fetch(proxy_url_list_repos).then(data => data.json())
}
export const checkToken = (userName: string): Promise<Response> => {
    const proxy_url_check_token = config.proxy_url_check_token + "?userName=" + userName;
    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_check_token, {
        method: "GET",
    }).then(data => data.json());
}
