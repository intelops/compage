import {createUserResource, getUserResource, patchUserResource} from "../store/user-client";
import {user_group, user_kind, user_version, UserResource, UserResourceSpec} from "../store/models";

const NAMESPACE = "compage";

// convertStringsToUserResourceSpec converts strings to userResource
const convertStringsToUserResourceSpec = (email: string, token: string) => {
    const userResourceSpec: UserResourceSpec = {
        email: email, token: token
    }
    return userResourceSpec
}

const prepareUserResource = (userName: string, userResourceSpec: UserResourceSpec) => {
    const metadata = {
        name: userName,
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
export const setToken = async (login: string, email: string, token: string) => {
    const existingUserResource = await getUserResource(NAMESPACE, login);
    // for non-existent resources apiVersion is empty.
    if (existingUserResource.apiVersion) {
        // if next time email is added to github, add it to existing resource.
        if (existingUserResource.spec.email === existingUserResource.metadata.name
            && email
            && login !== email) {
            existingUserResource.spec.email = email
        }
        existingUserResource.spec.token = token
        // we shouldn't change name as it will result in new user resource.

        // send spec only as the called method considers updating specs only.
        const createdUserResource = await patchUserResource(NAMESPACE, existingUserResource.metadata.name, JSON.stringify(existingUserResource.spec));
        if (createdUserResource.apiVersion) {
            console.log(createdUserResource.metadata.name + " user updated")
        } else {
            console.log(existingUserResource.metadata.name + " user couldn't be updated")
        }
        return
    }

    if (!email) {
        email = login
    }
    const newUserResourceSpec = convertStringsToUserResourceSpec(email, token);
    const newUserResource = prepareUserResource(login, newUserResourceSpec);
    const createdUserResource = await createUserResource(NAMESPACE, JSON.stringify(newUserResource));
    if (createdUserResource.apiVersion) {
        console.log(createdUserResource.metadata.name + " user added")
    } else {
        console.log(newUserResource.metadata.name + " user couldn't be added")
    }
}

// getToken returns tokens
export const getToken = async (login: string) => {
    const userResource = await getUserResource(NAMESPACE, login);
    const userResourceSpec: UserResourceSpec = userResource?.spec;
    return userResourceSpec?.token;
}