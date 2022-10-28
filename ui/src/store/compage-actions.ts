import compageSlice from './compage-slice'
import {AnyAction, ThunkAction} from '@reduxjs/toolkit'
import {RootState} from './index'
import {GeneratedProjectModel, GenerateProjectRequest} from "../models/redux-models";
import {generateProject} from "../service/compage-service";

export const compageActions = compageSlice.actions

export const generateProjectAction = (generateProjectRequest: GenerateProjectRequest): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        // const response: GeneratedProjectModel = generateProject(generateProjectRequest);
        // dispatch(compageActions.setGeneratedProject({name: response.name, fileChunk: response.fileChunk.toString()}))
    }
}
