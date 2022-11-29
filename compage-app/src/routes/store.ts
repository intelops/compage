import {LocalStorage} from 'node-localstorage'
const localStorage = new LocalStorage("./scratch");

export const setUser = (username: string, token: string) => {
    localStorage.setItem(username, token)
}

export const getUser = (username: string) => {
    return localStorage.getItem(username)
}