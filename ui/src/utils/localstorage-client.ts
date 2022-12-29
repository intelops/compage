import {CurrentProjectContext} from "../components/diagram-maker/models";

export const CURRENT_STATE = "STATE";
export const PROJECT_CONTEXT = "CURRENT_PROJECT_CONTEXT";
export const RESET = "RESET";
export const MODIFIED_STATE = "MODIFIED_STATE";
export const CURRENT_USER_NAME = "CURRENT_USER_NAME";

export const setCurrentProjectContext = (currentProjectContext: CurrentProjectContext) => {
    localStorage.setItem(PROJECT_CONTEXT, JSON.stringify(currentProjectContext));
};

export const getCurrentProjectContext = (): CurrentProjectContext => {
    return JSON.parse(localStorage.getItem(PROJECT_CONTEXT));
};

export const removeCurrentProjectContext = () => {
    return localStorage.removeItem(PROJECT_CONTEXT);
};

export const setReset = (value: boolean) => {
    localStorage.setItem(RESET, String(value));
};

export const shouldReset = () => {
    return localStorage.getItem(RESET) === "false";
};

export const setModifiedState = (payload: string) => {
    localStorage.setItem(MODIFIED_STATE, payload);
};

export const getModifiedState = () => {
    return localStorage.getItem(MODIFIED_STATE);
};

export const removeModifiedState = () => {
    localStorage.removeItem(MODIFIED_STATE);
};

export const retrieveCurrentUserName = () => {
    return localStorage.getItem(CURRENT_USER_NAME);
};

export const setCurrentUserName = (userName: string) => {
    localStorage.setItem(CURRENT_USER_NAME, userName);
};