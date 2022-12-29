import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectGenerateCodeStatus} from './slice';
import Button from "@mui/material/Button";
import {generateCodeAsync} from "./async-apis/generateCode";
import {getCurrentProjectContext} from "../../utils/localstorage-client";
import {CurrentProjectContext} from "../../components/diagram-maker/models";

export const GenerateCode = () => {
    const codeOperationsStatus = useAppSelector(selectGenerateCodeStatus);

    const dispatch = useAppDispatch();

    // When clicked, dispatch `generateCode`
    const handleGenerateCodeClick = () => {
        const currentProjectContext: CurrentProjectContext = getCurrentProjectContext();
        const generateCodeRequest = {
            projectId: currentProjectContext.projectId
        }
        if (codeOperationsStatus !== 'loading') {
            dispatch(generateCodeAsync(generateCodeRequest))
        }
    };

    return (
        <>
            {/*<span>{JSON.stringify(data)}</span>*/}
            {/*<span>{JSON.stringify(error)}</span>*/}
            <Button style={{
                width: "200px"
            }} variant="contained" onClick={handleGenerateCodeClick}>
                {codeOperationsStatus === "loading"
                    ? "Generating Code"
                    : "Generate Code"}
            </Button>
        </>
    );
}
