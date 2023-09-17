export interface GetCurrentContextRequest {
}

// This type describes the response object structure:
export interface GetCurrentContextResponse {
    contextName: string;
}

// This type describes the error object structure:
export interface GetCurrentContextError {
    message: string;
}


export const getGetCurrentContextError = (message: string) => {
    const getCurrentContextError: GetCurrentContextError = {
        message,
    };
    return getCurrentContextError;
};

export const getGetCurrentContextResponse = (contextName: string) => {
    const getCurrentContextResponse: GetCurrentContextResponse = {
        contextName,
    };
    return getCurrentContextResponse;
};