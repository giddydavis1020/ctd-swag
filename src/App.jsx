import './App.css';
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

function App() {

  const [todoList, setTodoList] = useState([]);
 
function addTodo(todoTitle) {
  const newTodo = {
    id: Date.now(),
    title: todoTitle,
    isCompleted: false,
  };

  setTodoList(previous => [newTodo, ...previous])
}

function completeTodo(id) {
  const updatedTodoList = todoList.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        isCompleted: true,
      };
    }

    return todo;
  });

  setTodoList(updatedTodoList);
}

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList 
        todoList={todoList}
        onCompleteTodo={completeTodo}
      />
      
    </div>
  );
}

export default App