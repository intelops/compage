export interface GenerateCodeResponse {
    projectId: string;
    userName: string;
    message: string;
}

// This type describes the error object structure:
export interface GenerateCodeError {
    message: string;
}

// generate code models
export interface GenerateCodeRequest {
    projectId: string;
    email: string;
}
