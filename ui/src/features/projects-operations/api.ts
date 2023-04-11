import {CreateProjectRequest, GetProjectRequest, ListProjectsRequest, UpdateProjectRequest} from "./model";
import {ProjectsBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const createProject = (createProjectRequest: CreateProjectRequest) => {
    return ProjectsBackendApi().post('', createProjectRequest);
};

// Sync apis (async apis are in thunk)
export const listProjects = (listProjectsRequest: ListProjectsRequest) => {
    return ProjectsBackendApi().get('');
};

// Sync apis (async apis are in thunk)
export const getProject = (getProjectRequest: GetProjectRequest) => {
    return ProjectsBackendApi().get('/' + getProjectRequest.id);
};

// Sync apis (async apis are in thunk)
export const updateProject = (updateProjectRequest: UpdateProjectRequest) => {
    return ProjectsBackendApi().put('/' + updateProjectRequest.id, updateProjectRequest);
};