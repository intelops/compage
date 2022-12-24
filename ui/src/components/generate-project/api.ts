import {GenerateProjectRequest} from "./model";
import {CompageBackendApi} from "../../service/backend-api";

// Sync apis (async apis are in thunk)
export const generateProject = (generateProjectRequest: GenerateProjectRequest) => {
    return CompageBackendApi().post('/generate_project', generateProjectRequest)
}
