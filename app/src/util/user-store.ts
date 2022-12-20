import {createUserResource, getUserResource} from "../store/user-client";
import {user_group, user_kind, user_version, UserResource, UserResourceSpec} from "../store/models";

const NAMESPACE = "compage";

// convertStringsToUserResourceSpec converts strings to userResource
const convertStringsToUserResourceSpec = (email: string, token: string) => {
    const userResourceSpec: UserResourceSpec = {
        email: email, token: token
    }
    return userResourceSpec
}

const prepareUserResource = (name: string, userResourceSpec: UserResourceSpec) => {
    const metadata = {
        name: name,
        namespace: NAMESPACE
    }
    const userResource: UserResource = {
        apiVersion: user_group + "/" + user_version,
        kind: user_kind,
        spec: userResourceSpec,
        metadata: metadata
    }
    return userResource
}

// setToken stores logged-in users details as CR(custom resource)
export const setToken = async (name: string, email: string, token: string) => {
    if (!email) {
        email = name
    }
    const userResourceSpec = convertStringsToUserResourceSpec(email, token);
    const userResource = prepareUserResource(name, userResourceSpec);
    console.log("JSON.stringify(userResource) : ", JSON.stringify(userResource))
    await createUserResource(NAMESPACE, JSON.stringify(userResource));
}

// getToken returns tokens
export const getToken = async (userName: string) => {
    const userResource = await getUserResource(NAMESPACE, userName);
    const userResourceSpec: UserResourceSpec = userResource.spec;
    return userResourceSpec.token;
}