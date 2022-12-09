import {get, set} from "../db/redis";


export const setUser = async (username: string, token: string) => {
    await set(username, token)
}

export const getUser = async (username: string) => {
    return await get(username)
}