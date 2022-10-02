import {config} from "../../utils/constants";

export const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    user: JSON.parse(localStorage.getItem("user")) || null,
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
};

export const backendEndpoints = {
    proxy_url_authenticate: config.proxy_url_authenticate,
    proxy_url_commit_changes: config.proxy_url_commit_changes,
    proxy_url_pull_changes: config.proxy_url_pull_changes,
    proxy_url_create_repo: config.proxy_url_create_repo,
    proxy_url_list_repos: config.proxy_url_list_repos,
    proxy_url_check_token: config.proxy_url_check_token,
    proxy_url_logout: config.proxy_url_logout,
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
            localStorage.setItem("user", JSON.stringify(action.payload.user))
            return {
                ...state,
                isLoggedIn: action.payload.isLoggedIn,
                user: action.payload.user
            };
        }
        case "LOGOUT": {
            localStorage.clear()
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        }
        default:
            return state;
    }
};
