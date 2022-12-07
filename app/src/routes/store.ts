import {get, set} from "../db/redis";


export const setUser = (username: string, token: string) => {
    set(username, token).then(r => console.log(r))
}

export const getUser = (username: string) => {
    get(username).then(value => {
        return value
    })
    return ""
}