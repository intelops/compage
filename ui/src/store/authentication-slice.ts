import {AuthenticationArrayModel, AuthenticationModel} from "../models/redux-models";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialAuthenticationState: AuthenticationArrayModel = {
    user: JSON.parse(localStorage.getItem("user")) || {
        login: "",
        email: "",
        name: ""
    },
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: initialAuthenticationState,
    reducers: {
        setUser(state, action: PayloadAction<AuthenticationModel>) {
            state.user = action.payload
        }
    }
})
export default authenticationSlice;