import {GitPlatformBackendApi} from "../../utils/backend-api";
import {CreateGitPlatformRequest, ListGitPlatformsRequest} from "./model";

// Sync apis (async apis are in thunk)
export const createGitPlatform = (createGitPlatformRequest: CreateGitPlatformRequest) => {
    return GitPlatformBackendApi().post('/', createGitPlatformRequest);
};


// Sync apis (async apis are in thunk)
export const listGitPlatforms = (listGitPlatformsRequest: ListGitPlatformsRequest) => {
    return GitPlatformBackendApi().get('/' + listGitPlatformsRequest.email);
};