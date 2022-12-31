import React from 'react';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectGenerateCodeStatus} from './slice';
import Button from "@mui/material/Button";
import {generateCodeAsync} from "./async-apis/generateCode";
import {getCurrentProject} from "../../utils/localstorage-client";
import {selectGetProjectData} from "../projects/slice";

export const GenerateCode = () => {
    const generateCodeStatus = useAppSelector(selectGenerateCodeStatus);
    const getProjectData = useAppSelector(selectGetProjectData);
    const dispatch = useAppDispatch();

    // When clicked, dispatch `generateCode`
    const handleGenerateCodeClick = () => {
        const currentProject: string = getCurrentProject();
        const generateCodeRequest = {
            projectId: currentProject
        }
        if (generateCodeStatus !== 'loading') {
            dispatch(generateCodeAsync(generateCodeRequest))
        }
    };

    // TODO need to revisit - every change in ui updates state and this will create chaos if checked directly.
    const isDisabled = () => {
        // TODO the below check will make sure to not enable/disable button more often.
        // if (getProjectData.json) {
        //     return removeUnwantedThings(JSON.parse(JSON.stringify(getProjectData.json))) !== removeUnwantedThings(JSON.parse(getCurrentState()));
        // }
        return false;
    };

    return (
        <>
            <Button style={{
                width: "200px"
            }} variant="contained" disabled={isDisabled()} onClick={handleGenerateCodeClick}>
                {generateCodeStatus === "loading"
                    ? "Generating Code"
                    : "Generate Code"}
            </Button>
        </>
    );
}
