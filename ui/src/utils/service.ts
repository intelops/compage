export const CURRENT_STATE = "STATE";
export const CURRENT_CONFIG = "CONFIG";
export const RESET = "RESET";
export const MODIFIED_STATE = "MODIFIED_STATE";

export const setCurrentState = (state: string) => {
    localStorage.setItem(CURRENT_STATE, state)
}

export const getCurrentState = () => {
    return localStorage.getItem(CURRENT_STATE)
}

export const removeCurrentState = () => {
    return localStorage.removeItem(CURRENT_STATE)
}

export const setCurrentConfig = (config: string) => {
    localStorage.setItem(CURRENT_CONFIG, config)
}

export const getCurrentConfig = () => {
    return localStorage.getItem(CURRENT_CONFIG)
}

export const removeCurrentConfig = () => {
    return localStorage.removeItem(CURRENT_CONFIG)
}

export const setReset = (value: boolean) => {
    localStorage.setItem(RESET, String(value))
}

export const shouldReset = () => {
    return localStorage.getItem(RESET) === "false";
}

export const setModifiedState = (payload: string) => {
    localStorage.setItem(MODIFIED_STATE, payload)
}

export const getModifiedState = () => {
    return localStorage.getItem(MODIFIED_STATE)
}
