import * as React from 'react';
import {useEffect} from 'react';
import {useAppDispatch} from "../../redux/hooks";
import {Stack} from "@mui/material";
import {GetCurrentContextRequest} from "../../features/k8s-operations/model";
import {getCurrentContextAsync} from "../../features/k8s-operations/async-apis/getCurrentContext";
import {getCurrentUser, isUserNotLoggedIn} from "../../utils/sessionstorageClient";
import {GitPlatforms} from "../../features/git-platforms-operations/git-platforms";
import {Projects} from "../../features/projects-operations/projects";
import {useNavigate} from "react-router-dom";

export const Account = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (isUserNotLoggedIn()) {
            navigate('/login');
        }
        const getCurrentProjectContext: GetCurrentContextRequest = {
            email: getCurrentUser()
        };
        dispatch(getCurrentContextAsync(getCurrentProjectContext));
    }, [dispatch, navigate]);


    return <>
        <Stack direction="column" spacing={2}>
            <Projects/>
            <GitPlatforms/>
        </Stack>
    </>;
};
