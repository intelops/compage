import authenticationSlice from './authentication-slice'
import {AnyAction, ThunkAction} from '@reduxjs/toolkit'
import {RootState} from './index'
import {AuthenticationModel} from "../models/redux-models";
import AuthenticationService from "../service/authentication-service";

export const authenticationActions = authenticationSlice.actions

export const fetchUser = (code: string): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        const response: AuthenticationModel = await AuthenticationService.authenticate(code);
        dispatch(authenticationActions.setUser(response))
    }
}
