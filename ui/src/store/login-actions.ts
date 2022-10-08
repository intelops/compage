import loginSlice from './login-slice'
import {AnyAction, ThunkAction} from '@reduxjs/toolkit'
import {RootState} from './index'
import {LoginModel} from "../models/redux-models";
import LoginService from "../service/loginService";

export const loginActions = loginSlice.actions

export const fetchUser = (code: string): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        const response: LoginModel = await LoginService.authenticate(code);
        dispatch(loginActions.setUser(response))
    }
}
