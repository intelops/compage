import {CurrentProjectContext} from "../components/diagram-maker/models";

export const CURRENT_PROJECT_CONTEXT = "CURRENT_PROJECT_CONTEXT";
export const RESET = "RESET";

export const setCurrentProjectContext = (currentProjectContext: CurrentProjectContext) => {
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
    const currentProjectContext = getCurrentProjectContext();
    currentProjectContext.modifiedState = payload;
    setCurrentProjectContext(currentProjectContext);
};

export const getModifiedState = () => {
    const currentProjectContext = getCurrentProjectContext();
    return currentProjectContext.modifiedState;
};

export const retrieveCurrentUserName = () => {
    const currentProjectContext = getCurrentProjectContext();
    return currentProjectContext?.userName;
};

export const setCurrentUserName = (userName: string) => {
    let currentProjectContext = getCurrentProjectContext();
    if (!currentProjectContext) {
        currentProjectContext = {
            projectId: "",
            state: "{}"
        }
    }
    currentProjectContext.userName = userName;
    setCurrentProjectContext(currentProjectContext);
};