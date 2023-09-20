import {ListGitPlatformsRequest} from "../model";
import {getCurrentUser} from "../../../utils/sessionstorageClient";
import {listGitPlatformsAsync} from "./listGitPlatforms";

export const refreshGitPlatformsList = () => {
    return async (dispatch) => {
        try {
            const listGitPlatformsRequest: ListGitPlatformsRequest = {
                email: getCurrentUser()
            };
            dispatch(listGitPlatformsAsync(listGitPlatformsRequest));
        } catch (error) {
            // Handle error if necessary
            console.log(error);
        }
    };
};
