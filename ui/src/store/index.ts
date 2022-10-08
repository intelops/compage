import {configureStore} from '@reduxjs/toolkit';
import todoSlice from './todo-slice'
import loginSlice from "./login-slice";

const store = configureStore(
    {
        reducer: {todo: todoSlice.reducer, authDetails: loginSlice.reducer}
    }
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;