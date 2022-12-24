import React from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectStatus} from './slice';
import Button from "@mui/material/Button";
import {generateProjectAsync} from "./async-apis/generateProject";

export const GenerateProject = () => {
    // TODO below values can be used if we want to get data from api
    // const data = useAppSelector(selectData);
    // const error = useAppSelector(selectError);
    const status = useAppSelector(selectStatus);

    const dispatch = useAppDispatch();
    const generateProjectRequest = {
        // TODO refer selected project here
        projectId: "mahen-first-31346"
    }

    // When clicked, dispatch `generateProject`:
    const handleClick = () => dispatch(generateProjectAsync(generateProjectRequest));

    return (
        <>
            {/*<span>{JSON.stringify(data)}</span>*/}
            {/*<span>{JSON.stringify(error)}</span>*/}
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleClick}>
                {status === "loading"
                    ? "Generating Project"
                    : "Generate Project"}
            </Button>
        </>
    );
}
