import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    const handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };

    const handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    };

    const handleUpdate = (event) => {
        if (!isEditing) {
            return;
        }

        event.preventDefault();

        if (!isValidTodoTitle(workingTitle)) {
            return;
        }

        onUpdateTodo({
            ...todo,
            title: workingTitle,
        });

        setIsEditing(false);
    };
    

    return (
        <li>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <TextInputWithLabel
                        value={workingTitle}
                        onChange={handleEdit}
                    />
                    <button
                        type="button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={!isValidTodoTitle(workingTitle)}
                    >
                        Update 
                    </button>
                </form>
            ) : (
                <form>
                    <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                    <span onClick={() => setIsEditing(true)}>
                        {todo.title}
                    </span>
                </form>
            )}
        </li>
    );

}

export default TodoListItem;