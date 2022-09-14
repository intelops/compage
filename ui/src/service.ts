const CURRENT_STATE = "STATE";
const CURRENT_CONFIG = "CONFIG";

export const setCurrentState = (state: string) => {
    localStorage.setItem(CURRENT_STATE, state)
}

export const getCurrentState = () => {
    return localStorage.getItem(CURRENT_STATE)
}

export const setCurrentConfig = (config: string) => {
    localStorage.setItem(CURRENT_CONFIG, config)
}

export const getCurrentConfig = () => {
    return localStorage.getItem(CURRENT_CONFIG)
}