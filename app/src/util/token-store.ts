import {createUser, getUser} from "../store/user-client";
import {UserResource} from "../store/models";

const NAMESPACE = "compage";

const createUserResource = (userName: string, email: string, token: string) => {
    const userResource: UserResource = {
        email: email, name: userName, token: token
    }
    return userResource
}

export const setToken = async (name: string, email: string, token: string) => {
    const userResource = createUserResource(name, email, token);
    await createUser(NAMESPACE, JSON.stringify(userResource))
}

export const getToken = async (userName: string) => {
    const user = await getUser(NAMESPACE, userName);
    //TODO
    return "user"
}