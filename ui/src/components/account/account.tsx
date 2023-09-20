import * as React from 'react';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Stack} from "@mui/material";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import {getCurrentUser, isUserNotLoggedIn} from "../../utils/sessionstorageClient";
import {useNavigate} from "react-router-dom";
import {selectGetUserData, selectGetUserStatus} from "../../features/users-operations/slice";
import {GetUserRequest} from "../../features/users-operations/model";
import {getUserAsync} from "../../features/users-operations/async-apis/getUser";
import {selectGetCurrentContextData, selectGetCurrentContextStatus} from "../../features/k8s-operations/slice";

export const Account = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const getUserData = useAppSelector(selectGetUserData);
    const getUserStatus = useAppSelector(selectGetUserStatus);
    const getCurrentContextData = useAppSelector(selectGetCurrentContextData);
    const getCurrentContextStatus = useAppSelector(selectGetCurrentContextStatus);

    useEffect(() => {
        if (isUserNotLoggedIn()) {
            navigate('/login');
        }
        if (getUserStatus !== 'loading') {
            const getUserRequest: GetUserRequest = {
                email: getCurrentUser()
            };
            dispatch(getUserAsync(getUserRequest));
        }
        if (getCurrentContextStatus !== 'loading') {
            const getCurrentProjectContext: GetCurrentContextRequest = {
                email: getCurrentUser()
            };
            dispatch(getCurrentContextAsync(getCurrentProjectContext));

        }
        // eslint-disable-next-line
    }, [dispatch, navigate]);


    return <>
        <Stack direction="column" spacing={2}>
            {getUserData && JSON.stringify(getUserData)}
            <br/>
            {getCurrentContextData && JSON.stringify(getCurrentContextData)}
        </Stack>
    </>;
};
