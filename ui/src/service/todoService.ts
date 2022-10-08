import Api from './Api';
import {TodoModel} from '../models/redux-models';

export default {
    async getAllTodos() {
        const response = await Api().get('todos');
        return response.data;
    },
    async getParticularTodo(todo_id: number) {
        const response = await Api().get('todos');
        return response.data.filter((todo: TodoModel) => todo.id === todo_id)[0];
    }
}