import {ListProjectsRequest} from "../model";
import {getCurrentUser} from "../../../utils/sessionstorageClient";
import {listProjectsAsync} from "./listProjects";

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
