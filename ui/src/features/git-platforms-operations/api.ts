import {GitPlatformBackendApi} from "../../utils/backendApi";
import {
    CreateGitPlatformRequest,
    DeleteGitPlatformRequest,
    ListGitPlatformsRequest,
    UpdateGitPlatformRequest
} from "./model";

// Sync apis (async apis are in thunk)
export const createGitPlatform = (createGitPlatformRequest: CreateGitPlatformRequest) => {
    return GitPlatformBackendApi().post("/users/" + createGitPlatformRequest.ownerEmail + "/gitPlatforms", createGitPlatformRequest);
};


// Sync apis (async apis are in thunk)
export const listGitPlatforms = (listGitPlatformsRequest: ListGitPlatformsRequest) => {
    return GitPlatformBackendApi().get("/users/" + listGitPlatformsRequest.email + "/gitPlatforms");
};

// Sync apis (async apis are in thunk)
export const updateGitPlatform = (updateGitPlatformRequest: UpdateGitPlatformRequest) => {
    return GitPlatformBackendApi().put("/users/" + updateGitPlatformRequest.ownerEmail + "/gitPlatforms", updateGitPlatformRequest);
};

// Sync apis (async apis are in thunk)
export const deleteGitPlatform = (deleteGitPlatformRequest: DeleteGitPlatformRequest) => {
    return GitPlatformBackendApi().delete("/users/" + deleteGitPlatformRequest.email + "/gitPlatforms");
};
