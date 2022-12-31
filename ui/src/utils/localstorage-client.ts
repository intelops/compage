import {CurrentProjectContext} from "../components/diagram-maker/models";

export const CURRENT_PROJECT_CONTEXT = "CURRENT_PROJECT_CONTEXT";
export const RESET = "RESET";
export const MODIFIED_STATE = "MODIFIED_STATE";

export const setCurrentProjectContext = (currentProjectContext: CurrentProjectContext) => {
    console.log("saving setCurrentProjectContext")
    localStorage.setItem(CURRENT_PROJECT_CONTEXT, JSON.stringify(currentProjectContext));
};

export const getCurrentProjectContext = (): CurrentProjectContext => {
    return JSON.parse(localStorage.getItem(CURRENT_PROJECT_CONTEXT));
};

export const removeCurrentProjectContext = () => {
    return localStorage.removeItem(CURRENT_PROJECT_CONTEXT);
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
