import {CompageArrayModel, CompageModel} from "../models/redux-models";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchTodos} from "../service/compage-service";
import {RootState} from "./index";

const initialCompageState: CompageArrayModel = {
    error: null,
    status: "idle",
    all_todos: [],
    particular_todo: {
        "userId": 0,
        "id": 0,
        "title": "",
        "completed": false
    }
}

const compageSlice = createSlice({
    name: 'compage',
    initialState: initialCompageState,
    reducers: {
        setTodos(state, action: PayloadAction<CompageModel[]>) {
            state.all_todos = action.payload;
        },
        setParticularTodo(state, action: PayloadAction<CompageModel>) {
            state.particular_todo = action.payload;
        }
    },

    // In `extraReducers` we declare
    // all the actions:
    extraReducers: (builder) => {

        // When we send a request,
        // `fetchTodos.pending` is being fired:
        builder.addCase(fetchTodos.pending, (state) => {
            // At that moment,
            // we change status to `loading`
            // and clear all the previous errors:
            state.status = "loading";
            state.error = null;
        });

        // When a server responses with the data,
        // `fetchTodos.fulfilled` is fired:
        builder.addCase(fetchTodos.fulfilled,
            (state, {payload}) => {
                // We add all the new todos into the state
                // and change `status` back to `idle`:
                state.all_todos.push(...payload);
                state.status = "idle";
            });

        // When a server responses with an error:
        builder.addCase(fetchTodos.rejected,
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