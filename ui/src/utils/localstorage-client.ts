import {CurrentProjectContext} from "../components/diagram-maker/models";

export const CURRENT_STATE = "STATE";
export const CURRENT_CONFIG = "CONFIG";
export const PROJECT_CONTEXT = "CURRENT_PROJECT_CONTEXT";
export const RESET = "RESET";
export const MODIFIED_STATE = "MODIFIED_STATE";
export const CURRENT_USER_NAME = "CURRENT_USER_NAME";

export const setCurrentState = (state: string) => {
    localStorage.setItem(CURRENT_STATE, state);
}

export const getCurrentState = () => {
    return localStorage.getItem(CURRENT_STATE);
}

export const removeCurrentState = () => {
    return localStorage.removeItem(CURRENT_STATE);
}

export const setCurrentConfig = (config: string) => {
    localStorage.setItem(CURRENT_CONFIG, config);
}

export const getCurrentConfig = () => {
    return localStorage.getItem(CURRENT_CONFIG);
}

export const setCurrentProjectContext = (currentProjectContext: CurrentProjectContext) => {
    localStorage.setItem(PROJECT_CONTEXT, JSON.stringify(currentProjectContext));
}

export const getCurrentProjectContext = (): CurrentProjectContext => {
    return JSON.parse(localStorage.getItem(PROJECT_CONTEXT));
}

export const removeCurrentProjectContext = () => {
    return localStorage.removeItem(PROJECT_CONTEXT);
}

export const removeCurrentConfig = () => {
    return localStorage.removeItem(CURRENT_CONFIG);
}

export const setReset = (value: boolean) => {
    localStorage.setItem(RESET, String(value));
}

export const shouldReset = () => {
    return localStorage.getItem(RESET) === "false";
}

export const setModifiedState = (payload: string) => {
    localStorage.setItem(MODIFIED_STATE, payload);
}

export const getModifiedState = () => {
    return localStorage.getItem(MODIFIED_STATE);
}

export const removeModifiedState = () => {
    localStorage.removeItem(MODIFIED_STATE);
}

export const retrieveCurrentUserName = () => {
    return localStorage.getItem(CURRENT_USER_NAME);
}

export const setCurrentUserName = (userName: string) => {
    localStorage.setItem(CURRENT_USER_NAME, userName)
}