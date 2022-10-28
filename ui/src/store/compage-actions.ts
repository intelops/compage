import compageSlice from './compage-slice'
import {AnyAction, ThunkAction} from '@reduxjs/toolkit'
import {RootState} from './index'
import {CompageModel} from "../models/redux-models";
import TodoService from "../service/compage-service";

export const compageActions = compageSlice.actions

// export const fetchTodos = (): ThunkAction<void, RootState, unknown, AnyAction> => {
//     return async (dispatch, getState) => {
//         if (getState().todo.all_todos.length === 0) {
//             const response: TodoModel[] = await TodoService.getAllTodos();
//             dispatch(todoActions.setTodos(response))
//         }
//     }
//
// }
export const fetchParticularTodo = (todo_id: number): ThunkAction<void, RootState, unknown, AnyAction> => {
    return async (dispatch, getState) => {
        const response: CompageModel = await TodoService.getParticularTodo(todo_id);
        dispatch(compageActions.setParticularTodo(response))
    }
}
