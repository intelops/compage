import {CreateProjectRequest, GetProjectRequest, ListProjectsRequest, UpdateProjectRequest} from "./model";
import {ProjectsBackendApi} from "../../utils/backend-api";

// Sync apis (async apis are in thunk)
export const createProject = (createProjectRequest: CreateProjectRequest) => {
    return ProjectsBackendApi().post("/users/"+createProjectRequest.ownerEmail+"/projects", createProjectRequest);
};

// Sync apis (async apis are in thunk)
export const listProjects = (listProjectsRequest: ListProjectsRequest) => {
    return ProjectsBackendApi().get("/users/" + listProjectsRequest.email + "/projects");
};

// Sync apis (async apis are in thunk)
export const getProject = (getProjectRequest: GetProjectRequest) => {
    return ProjectsBackendApi().get("/users/" + getProjectRequest.email + "/projects/" + getProjectRequest.id);
};

// Sync apis (async apis are in thunk)
export const updateProject = (updateProjectRequest: UpdateProjectRequest) => {
    return ProjectsBackendApi().put("/users/" + updateProjectRequest.ownerEmail + "/projects/" + updateProjectRequest.id, updateProjectRequest);
};