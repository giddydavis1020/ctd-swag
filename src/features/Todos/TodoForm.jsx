import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { useRef, useState } from 'react';
import { isValidTodoTitle } from '../../utils/todoValidation.js';


function TodoForm({ onAddTodo }) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');


    const handleAddTodo = (event) => {
        event.preventDefault();


        const todoTitle = workingTodoTitle.trim();

        if (todoTitle && todoTitle !== "") {
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };


    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel
                ref={inputRef}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                elementId="todoTitle"
                labelText="Todo"
            />
            <button disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
        </form>

    );
}

export default TodoForm;