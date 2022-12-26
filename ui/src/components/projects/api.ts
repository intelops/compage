import {CreateProjectRequest} from "./model";
import {ProjectsBackendApi} from "../../service/backend-api";

// Sync apis (async apis are in thunk)
export const createProject = (createProjectRequest: CreateProjectRequest) => {
    return ProjectsBackendApi().post('/', createProjectRequest)
}

// Sync apis (async apis are in thunk)
export const listProjects = () => {
    return ProjectsBackendApi().get('/')
}