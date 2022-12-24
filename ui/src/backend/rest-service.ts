import {getCurrentRepositoryDetails} from "../utils/service";
import {getBase64EncodedStringForConfig} from "../components/diagram-maker/helper/helper";
import {config} from "../utils/constants";
import {GenerateCodeRequest} from "../models/redux-models";

export const pullCompageYaml = (userName: string, repositoryName: string): Promise<Response> => {
    const proxy_url_pull_compage_yaml = config.proxy_url_pull_compage_yaml + "?userName=" + userName + "&repositoryName=" + (repositoryName || getCurrentRepositoryDetails().repositoryName);
    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_pull_compage_yaml, {
        method: "GET",
    }).then(data => data.json());
}
export const commitCompageYaml = (userName: string, userEmail: string, message: string): Promise<Response> => {
    const requestBody = {
        message: message,
        committer: {
            userName: userName,
            email: userEmail
        },
        content: getBase64EncodedStringForConfig(),
        sha: getCurrentRepositoryDetails().details.sha,
        repositoryName: getCurrentRepositoryDetails().repositoryName
    };
    const proxy_url_commit_compage_yaml = config.proxy_url_commit_compage_yaml;

    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_commit_compage_yaml, {
        method: "PUT",
        body: JSON.stringify(requestBody)
    }).then(data => data.json());
}
export const createRepository = (userName: string, repositoryName: string, repoDescription: string): Promise<Response> => {
    const requestBody = {
        repositoryName: repositoryName, description: repoDescription, userName: userName
    };

    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(config.proxy_url_create_repository, {
        method: "POST",
        body: JSON.stringify(requestBody)
    }).then(data => data.json());
}
export const generateCode = (generateCodeRequest: GenerateCodeRequest):
    Promise<Response> => {
    const requestBody = {
        projectId: generateCodeRequest.projectId,
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
export const listRepositories = (userName: string) => {
    const proxy_url_list_repositories = config.proxy_url_list_repositories + "?userName=" + userName
    return fetch(proxy_url_list_repositories).then(data => data.json())
}
export const checkToken = (userName: string): Promise<Response> => {
    const proxy_url_check_token = config.proxy_url_check_token + "?userName=" + userName;
    // Use code parameter and other parameters to make POST request to proxy_server
    return fetch(proxy_url_check_token, {
        method: "GET",
    }).then(data => data.json());
}
