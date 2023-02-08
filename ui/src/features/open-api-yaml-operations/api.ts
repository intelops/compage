import {UploadYamlRequest} from "./model";
import {CodeOperationsBackendApi, OpenApiYamlOperationsBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const uploadYaml = (uploadYamlRequest: UploadYamlRequest) => {
    return OpenApiYamlOperationsBackendApi().post('/upload', uploadYamlRequest)
}
