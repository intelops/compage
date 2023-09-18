export interface GetCurrentContextRequest {
    email: string;
}

// This type describes the response object structure:
export interface GetCurrentContextResponse {
    contextName: string;
}

// This type describes the error object structure:
export interface GetCurrentContextError {
    message: string;
}