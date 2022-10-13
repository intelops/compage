import {useAppDispatch, useAppSelector} from "../hooks/redux-hooks";
import {fetchParticularTodo} from '../store/todo-actions';
import {useState} from 'react'
import './Todo.css'
import {fetchTodos} from "../service/todoService";
import {selectStatus} from "../store/todo-slice";

const Todo = () => {
    const [todo_id, setTodo_id] = useState(1);
    const dispatch = useAppDispatch();
    const alltodos = useAppSelector(state => state.todo.all_todos);
    const particularTodo = useAppSelector(state => state.todo.particular_todo);
    const clickHandler = () => {
        // dispatch(fetchTodos())
    }
    const searchHandler = () => {
        dispatch(fetchParticularTodo(todo_id))
    }
    const checkTodo = (): boolean => {
        return alltodos.length !== 0;
    }
    const checkparticularTodo = (): boolean => {
        if (particularTodo.id === 0) {
            return false
        }
        return true
    }
    const status = useAppSelector(selectStatus);

    // When clicked, dispatch `fetchTodos`:
    const handleClick = () => dispatch(fetchTodos(10));

    return (
        <>
            <div>
                <button type="button" onClick={handleClick}>
                    {status === "loading"
                        ? "Loading todos..."
                        : "Load todos"}
                </button>
                <label>Enter the todo id : </label>
                <input onChange={(event) => {
                    setTodo_id(parseInt(event.target.value))
                }} type="number"></input>
                <button onClick={searchHandler}> Find</button>
                <div>
                    <h3>Particular TODO </h3>
                    {
                        checkparticularTodo() &&
                        (<div className="todo-container" key={particularTodo.userId + particularTodo.id}>
                            <p className="todo-child1">{particularTodo.id}</p>
                            <p className="todo-child2">{particularTodo.userId}</p>
                            <p className="todo-child3">{particularTodo.title}</p>
                            <p className="todo-child4">{particularTodo.completed}</p>
                        </div>)
                    }

                </div>
            </div>
            <div>
                <button onClick={clickHandler}>All Todos</button>
                <div>
                    <h3>TODO LIST :</h3>
                    <div className="todo-container">
                        <p className="todo-child1">ID</p>
                        <p className="todo-child2">USER ID</p>
                        <p className="todo-child3">TITLE</p>
                    </div>
                    {checkTodo() &&
                        alltodos.map((todo) => (
                            <div className="todo-container" /*key={todo.userId + todo.id}*/>
                                <p className="todo-child1">{todo.id}</p>
                                <p className="todo-child2">{todo.userId}</p>
                                <p className="todo-child3">{todo.title}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>

    );
}
export default Todo;