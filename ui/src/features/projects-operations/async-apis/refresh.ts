import {GetProjectRequest, ListProjectsRequest} from "../model";
import {getCurrentUser} from "../../../utils/sessionstorageClient";
import {listProjectsAsync} from "./listProjects";
import {getProjectAsync} from "./getProject";

export const refreshProjectsList = () => {
    return async (dispatch) => {
        try {
            const listProjectsRequest: ListProjectsRequest = {
                email: getCurrentUser()
            };
            dispatch(listProjectsAsync(listProjectsRequest));
        } catch (error) {
            // Handle error if necessary
            console.log(error);
        }
    };
};

export const refreshCurrentProject = (id: string) => {
    return async (dispatch) => {
        try {
            const getProjectRequest: GetProjectRequest = {
                email: getCurrentUser(),
                id
            };
            dispatch(getProjectAsync(getProjectRequest));
        } catch (error) {
            // Handle error if necessary
            console.log(error);
        }
    };
};
