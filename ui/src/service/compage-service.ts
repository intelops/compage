import Api from './Api';
import {CompageModel} from '../models/redux-models';
import {createAsyncThunk} from "@reduxjs/toolkit";
import {toastr} from 'react-redux-toastr'

export default {
    async getAllTodos() {
        const response = await Api().get('todos');
        return response.data;
    },
    async getParticularTodo(todo_id: number) {
        const response = await Api().get('todos');
        const filterElement = response.data.filter((todo: CompageModel) => todo.id === todo_id)[0];
        toastr.info('Response Received', JSON.stringify(filterElement))
        return filterElement;
    }
}

// This type describes the error object structure:
type FetchTodosError = {
    message: string;
};

export const fetchTodos = createAsyncThunk<CompageModel[],
    number,
    { rejectValue: FetchTodosError }>(
    // The first argument is the action name:
    "todos/fetch",
    // The second one is a function
    // called payload creator.
    // It contains async logic of a side-effect.
    // We can perform requests here,
    // work with device API,
    // or any other async APIs we need to.
    async (limit: number, thunkApi) => {
        // Fetch the backend endpoint:
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`
        );

        // Check if status is not okay:
        if (response.status !== 200) {
            // Return the error message:
            return thunkApi.rejectWithValue({
                message: "Failed to fetch todos."
            });
        }
        // Get the JSON from the response:
        const data: CompageModel[] = await response.json();

        console.log(data)
        // Return result:
        return data;
    }
);