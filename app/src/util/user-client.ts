import {createUserResource, getUserResource, patchUserResource} from '../store/user-store';
import {USER_GROUP, USER_KIND, USER_VERSION, UserResource, UserResourceSpec} from '../store/models';

const NAMESPACE = 'compage';

// convertStringsToUserResourceSpec converts strings to userResource
const convertStringsToUserResourceSpec = (email: string, token: string) => {
    const userResourceSpec: UserResourceSpec = {
        email, token
    };
    return userResourceSpec;
};

const prepareUserResource = (userName: string, userResourceSpec: UserResourceSpec) => {
    const metadata = {
        name: userName,
        namespace: NAMESPACE
    };
    const userResource: UserResource = {
        apiVersion: USER_GROUP + '/' + USER_VERSION,
        kind: USER_KIND,
        spec: userResourceSpec,
        metadata
    };
    return userResource;
};

// setToken stores logged-in users details as CR(custom resource)
export const setToken = async (login: string, email: string, token: string) => {
    const existingUserResource = await getUserResource(NAMESPACE, login);
    // for non-existent resources apiVersion is empty.
    if (existingUserResource.apiVersion) {
        // if next time email is added to GitHub, add it to existing resource.
        if (existingUserResource.spec.email === existingUserResource.metadata.name
            && email
            && login !== email) {
            existingUserResource.spec.email = email;
        }
        existingUserResource.spec.token = token;
        // we shouldn't change name as it will result in new user resource.

        // send spec only as the called method considers updating specs only.
        return await patchUserResource(NAMESPACE, existingUserResource.metadata.name, JSON.stringify(existingUserResource.spec));
    }

    if (!email) {
        email = login;
    }
    const newUserResourceSpec = convertStringsToUserResourceSpec(email, token);
    const newUserResource = prepareUserResource(login, newUserResourceSpec);
    return await createUserResource(NAMESPACE, JSON.stringify(newUserResource));
};

// getToken returns tokens
export const getToken = async (login: string) => {
    const userResource = await getUserResource(NAMESPACE, login);
    const userResourceSpec: UserResourceSpec = userResource?.spec;
    return userResourceSpec?.token;
};