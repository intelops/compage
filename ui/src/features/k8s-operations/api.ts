import {K8sOperationsBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const getCurrentContext = () => {
    return K8sOperationsBackendApi().get('/current-context');
};

