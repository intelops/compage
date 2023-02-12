import {UploadYamlRequest} from "./model";
import {OpenApiYamlOperationsBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const uploadYaml = (uploadYamlRequest: UploadYamlRequest) => {
    const formData = new FormData();
    formData.append('file', uploadYamlRequest.file);
    formData.append('nodeId', uploadYamlRequest.nodeId);
    formData.append('projectId', uploadYamlRequest.projectId);
    formData.append('template', uploadYamlRequest.template);
    formData.append('framework', uploadYamlRequest.framework);
    return OpenApiYamlOperationsBackendApi().post('/upload', formData, {})
}
