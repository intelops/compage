import {CreatedProjectArrayModel, CreatedProjectModel} from "../models/redux-models";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createProject} from "../service/compage-service";
import {RootState} from "./index";

const initialCompageState: CreatedProjectArrayModel = {
    error: null,
    status: "idle",
    createdProject: {
        "name": "",
        "fileChunk": undefined
    }
}

const compageSlice = createSlice({
    name: 'compage',
    initialState: initialCompageState,
    reducers: {
        setGeneratedProject(state, action: PayloadAction<CreatedProjectModel>) {
            console.log("action.payload : " + action.payload)
            state.createdProject = action.payload;
        }
    },

    // In `extraReducers` we declare
    // all the actions:
    extraReducers: (builder) => {
        // When we send a request,
        // `generateProject.pending` is being fired:
        builder.addCase(createProject.pending, (state) => {
            // At that moment,
            // we change status to `loading`
            // and clear all the previous errors:
            state.status = "loading";
            state.error = null;
        });

        // When a server responses with the data,
        // `generateProject.fulfilled` is fired:
        builder.addCase(createProject.fulfilled,
            (state, {payload}) => {
                // We add all the new todos into the state
                // and change `status` back to `idle`:
                // TODO may be problematic
                state.createdProject = payload[0];
                state.status = "idle";
            });

        // When a server responses with an error:
        builder.addCase(createProject.rejected,
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