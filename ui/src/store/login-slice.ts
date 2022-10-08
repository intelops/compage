import {LoginArrayModel, LoginModel} from "../models/redux-models";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialLoginState: LoginArrayModel = {
    user: JSON.parse(localStorage.getItem("user")) || {
        login: "",
        email: "",
        name: ""
    },
}

const loginSlice = createSlice({
    name: 'authDetails',
    initialState: initialLoginState,
    reducers: {
        setUser(state, action: PayloadAction<LoginModel>) {
            state.user = action.payload
        }
    }
})
export default loginSlice;