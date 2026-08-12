import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function TodoListItem({ todo, onCompleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);


    return (
        <li>
            {isEditing ? (
                <TextInputWithLabel
                    value={todo.title}
                />

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