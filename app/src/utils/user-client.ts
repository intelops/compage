import {createUserResource, listUserResources, patchUserResource} from '../store/user-store';
import {USER_GROUP, USER_KIND, USER_VERSION, UserResource, UserResourceSpec} from '../store/models';
import Logger from './logger';
import {GitPlatformDTO} from "../models/git-platform";

const NAMESPACE = 'compage';

// convertStringsToUserResourceSpec converts strings to userResource
const convertToUserResourceSpec = (email: string, gitPlatform: GitPlatformDTO) => {
    const gitPlatforms: GitPlatformDTO[] = [];

    gitPlatforms.push(gitPlatform);
    const userResourceSpec: UserResourceSpec = {
        email, gitPlatforms
    };
    return userResourceSpec;
};

const prepareUserResource = (email: string, userResourceSpec: UserResourceSpec) => {
    const metadata = {
        // TODO: check if this is the right way to set name
        name: email,
        namespace: NAMESPACE,
        labels: {
            email
        }
    };
    const userResource: UserResource = {
        apiVersion: USER_GROUP + '/' + USER_VERSION,
        kind: USER_KIND,
        spec: userResourceSpec,
        metadata
    };
    return userResource;
};

// setGitPlatformDetails stores user's git platform details in the CR(custom resource)
export const setGitPlatformDetails = async (email: string, gitPlatform: GitPlatformDTO) => {
    // filter out by email
    const filter = `email=${email}`;
    const userResources: UserResource[] = await listUserResources(NAMESPACE, filter);
    if (userResources.length > 1) {
        Logger.error('multiple users found');
        throw new Error('multiple users found');
    }
    if (userResources.length > 0) {
        const existingUserResource: UserResource = userResources[0];
        // for non-existent resources apiVersion is empty.
        if (existingUserResource.apiVersion) {
            // update existing user resource
            existingUserResource.spec.gitPlatforms.forEach((gp, index) => {
                if (gp.name === gitPlatform.name) {
                    existingUserResource.spec.gitPlatforms[index] = gitPlatform;
                }
            });
            // we shouldn't change name as it will result in new user resource.
            // send spec only as the called method considers updating specs only.
            return await patchUserResource(NAMESPACE, existingUserResource.metadata.name, JSON.stringify(existingUserResource.spec));
        }
    }

    const newUserResourceSpec = convertToUserResourceSpec(email, gitPlatform);
    const newUserResource = prepareUserResource(email, newUserResourceSpec);
    return await createUserResource(NAMESPACE, JSON.stringify(newUserResource));
};

// getGitPlatformTokens returns gitPlatform tokens
export const getGitPlatformToken = async (email: string, gitPlatformName: string) => {
    const userResources: UserResource[] = await listUserResources(NAMESPACE, `email=${email}`);
    if (userResources.length > 1) {
        Logger.error('multiple users found');
        throw new Error('multiple users found');
    }
    if (userResources.length > 0) {
        const userResource: UserResource = userResources[0];
        // for non-existent resources apiVersion is empty.
        if (userResource.apiVersion) {
            userResource.spec.gitPlatforms.forEach((gp) => {
                if (gp.name === gitPlatformName) {
                    return gp;
                }
            });
        }
    }
    return '';
};

// getGitPlatforms returns gitPlatforms
export const getGitPlatforms = async (email: string) => {
    const userResources: UserResource[] = await listUserResources(NAMESPACE, `email=${email}`);
    if (userResources.length > 1) {
        Logger.error('multiple users found');
        throw new Error('multiple users found');
    }
    if (userResources.length > 0) {
        const userResource: UserResource = userResources[0];
        // for non-existent resources apiVersion is empty.
        if (userResource.apiVersion) {
            return userResource.spec.gitPlatforms;
        }
    }
    return [];
};