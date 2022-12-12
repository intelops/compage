import {createUserResource, getUserResource} from "../store/user-client";
import {UserResource} from "../store/models";

const NAMESPACE = "compage";

const convertStringsToUserResource = (userName: string, email: string, token: string) => {
    const userResource: UserResource = {
        email: email, name: userName, token: token
    }
    return userResource
}

export const setToken = async (name: string, email: string, token: string) => {
    const userResource = convertStringsToUserResource(name, email, token);
    await createUserResource(NAMESPACE, JSON.stringify(userResource))
}

export const getToken = async (userName: string) => {
    const user = await getUserResource(NAMESPACE, userName);
    //TODO
    return "user"
}