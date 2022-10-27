export const setUser = (username: string, token: string) => {
    localStorage.setItem(username, token)
}

export const getUser = (username: string) => {
    return localStorage.getItem(username)
}