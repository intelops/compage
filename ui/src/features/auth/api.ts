import {LoginRequest} from "./model";
import {AuthBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const login = (loginRequest: LoginRequest) => {
    return AuthBackendApi().post('/authenticate', loginRequest);
};