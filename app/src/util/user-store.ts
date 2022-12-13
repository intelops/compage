import {createUserResource, getUserResource} from "../store/user-client";
import {user_group, user_kind, user_version, UserResource, UserResourceSpec} from "../store/models";

const NAMESPACE = "compage";

// convertStringsToUserResourceSpec converts strings to userResource
const convertStringsToUserResourceSpec = (userName: string, email: string, token: string) => {
    const userResourceSpec: UserResourceSpec = {
        email: email, name: userName, token: token
    }
    return userResourceSpec
}

const prepareUserResource = (userResourceSpec: UserResourceSpec) => {
    const userResource: UserResource = {
        apiVersion: user_group + "/" + user_version,
        kind: user_kind,
        spec: userResourceSpec,
        //TODO how below var will get populated.
        metadata: ""
    }
    return userResource
}

// setToken stores logged-in users details as CR(custom resource)
export const setToken = async (name: string, email: string, token: string) => {
    const userResourceSpec = convertStringsToUserResourceSpec(name, email, token);
    const userResource = prepareUserResource(userResourceSpec);
    await createUserResource(NAMESPACE, JSON.stringify(userResource));
}

// getToken returns tokens
export const getToken = async (userName: string) => {
    const userResource = await getUserResource(NAMESPACE, userName);
    const userResourceSpec: UserResourceSpec = userResource.spec;
    return userResourceSpec.token;
}