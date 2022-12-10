import {client} from "../db/redis";

export const setToken = async (username: string, token: string) => {
    await client.set(username, token)
}

export const getToken = async (username: string) => {
    return await client.get(username);
}