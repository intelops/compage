import {CreateProjectRequest, GetProjectRequest, ListProjectsRequest} from "./model";
import {ProjectsBackendApi} from "../../service/backend-api";

// Sync apis (async apis are in thunk)
export const createProject = (createProjectRequest: CreateProjectRequest) => {
    return ProjectsBackendApi().post('/', createProjectRequest);
}

// Sync apis (async apis are in thunk)
export const listProjects = (listProjectsRequest: ListProjectsRequest) => {
    return ProjectsBackendApi().get('/');
}

// Sync apis (async apis are in thunk)
export const getProject = (getProjectRequest: GetProjectRequest) => {
    return ProjectsBackendApi().get('/' + getProjectRequest.id);
}