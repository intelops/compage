import {GenerateCodeRequest} from "./model";
import {CodeOperationsBackendApi} from "../../utils/backendApi";

// Sync apis (async apis are in thunk)
export const generateCode = (generateCodeRequest: GenerateCodeRequest) => {
    return CodeOperationsBackendApi().post('/generate', generateCodeRequest);
};
