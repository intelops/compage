import React from 'react';

import {useAppDispatch, useAppSelector} from '../../hooks/redux-hooks';
import {selectStatus} from './slice';
import Button from "@mui/material/Button";
import {generateCodeAsync} from "./async-apis/generate";

export const GenerateCode = () => {
    // TODO below values can be used if we want to get data from api
    // const data = useAppSelector(selectData);
    // const error = useAppSelector(selectError);
    const status = useAppSelector(selectStatus);

    const dispatch = useAppDispatch();
    const generateCodeRequest = {
        // TODO refer selected project here
        projectId: "mahen-first-14510"
    }

    // When clicked, dispatch `generateCode`:
    const handleClick = () => dispatch(generateCodeAsync(generateCodeRequest));

    return (
        <>
            {/*<span>{JSON.stringify(data)}</span>*/}
            {/*<span>{JSON.stringify(error)}</span>*/}
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleClick}>
                {status === "loading"
                    ? "Generating Code"
                    : "Generate Code"}
            </Button>
        </>
    );
}
