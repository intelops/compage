import {GeneratedProjectArrayModel, GeneratedProjectModel} from "../models/redux-models";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {generateProject} from "../service/compage-service";
import {RootState} from "./index";

const initialCompageState: GeneratedProjectArrayModel = {
    error: null,
    status: "idle",
    generatedProject: {
        "name": "",
        "fileChunk": undefined
    }
}

const compageSlice = createSlice({
    name: 'compage',
    initialState: initialCompageState,
    reducers: {
        setGeneratedProject(state, action: PayloadAction<GeneratedProjectModel>) {
            console.log("action.payload : " + action.payload)
            state.generatedProject = action.payload;
        }
    },

    // In `extraReducers` we declare
    // all the actions:
    extraReducers: (builder) => {
        // When we send a request,
        // `generateProject.pending` is being fired:
        builder.addCase(generateProject.pending, (state) => {
            // At that moment,
            // we change status to `loading`
            // and clear all the previous errors:
            state.status = "loading";
            state.error = null;
        });

        // When a server responses with the data,
        // `generateProject.fulfilled` is fired:
        builder.addCase(generateProject.fulfilled,
            (state, {payload}) => {
                // We add all the new todos into the state
                // and change `status` back to `idle`:
                // TODO may be problematic
                state.generatedProject = payload[0];
                state.status = "idle";
            });

        // When a server responses with an error:
        builder.addCase(generateProject.rejected,
            (state, {payload}) => {
                // We show the error message
                // and change `status` back to `idle` again.
                if (payload) state.error = payload.message;
                state.status = "idle";
            });
    },
})
export default compageSlice;
export const selectStatus = (state: RootState) =>
    state.compage.status;