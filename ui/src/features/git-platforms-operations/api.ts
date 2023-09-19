import {GitPlatformBackendApi} from "../../utils/backendApi";
import {CreateGitPlatformRequest, ListGitPlatformsRequest} from "./model";

// Sync apis (async apis are in thunk)
export const createGitPlatform = (createGitPlatformRequest: CreateGitPlatformRequest) => {
    return GitPlatformBackendApi().post("/users/" + createGitPlatformRequest.ownerEmail + "/gitPlatforms", createGitPlatformRequest);
};


// Sync apis (async apis are in thunk)
export const listGitPlatforms = (listGitPlatformsRequest: ListGitPlatformsRequest) => {
    return GitPlatformBackendApi().get("/users/" + listGitPlatformsRequest.email + "/gitPlatforms");
};