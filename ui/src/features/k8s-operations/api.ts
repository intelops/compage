import {K8sOperationsBackendApi} from "../../utils/backendApi";

// Sync apis (async apis are in thunk)
export const getCurrentContext = () => {
    return K8sOperationsBackendApi().get('/current-context');
};

