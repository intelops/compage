import React from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectStatus} from './slice';
import Button from "@mui/material/Button";
import {createProjectAsync} from "./async-apis/create";

export const CreateProject = () => {
    // TODO below values can be used if we want to get data from api
    // const data = useAppSelector(selectData);
    // const error = useAppSelector(selectError);
    const status = useAppSelector(selectStatus);

    const dispatch = useAppDispatch();
    const createProjecRequest = {
        // TODO refer selected project here
        projectId: "mahen-first-14510"
    }

    // When clicked, dispatch `createProject`:
    const handleClick = () => dispatch(createProjectAsync(createProjecRequest));

    return (
        <>
            {/*<span>{JSON.stringify(data)}</span>*/}
            {/*<span>{JSON.stringify(error)}</span>*/}
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleClick}>
                {status === "loading"
                    ? "Creating Project"
                    : "Create Project"}
            </Button>
        </>
    );
}
