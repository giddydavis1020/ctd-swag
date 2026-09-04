import { useCallback, useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import useDebounce from '../../utils/useDebounce.js';
import FilterInput from '../../shared/FilterInput.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

function TodosPage() {
    const { token } = useAuth();

    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [filterError, setFilterError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(true);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterTerm, setFilterTerm] = useState('');
    const [dataVersion, setDataVersion] = useState(0);

    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    const invalidateCache = useCallback(() => {
        setDataVersion(version => version + 1);
    }, []);

    const handleFilterChange = newTerm => {
        setFilterTerm(newTerm);
    };

    useEffect(() => {
        async function fetchTodos() {
            setIsTodoListLoading(true);
            setError('');

            try {
                const paramsObject = {
                    sortBy,
                    sortDirection,
                    limit: 100,
                };

                if (debouncedFilterTerm) {
                    paramsObject.find = debouncedFilterTerm;
                }

                const params = new URLSearchParams(paramsObject);

                const response = await fetch(`/api/tasks?${params}`, {
                    headers: {
                        'X-CSRF-TOKEN': token,
                    },
                    credentials: 'include',
                });

                if (response.status === 401) {
                    throw new Error('unauthorized');
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch todos');
                }

                const data = await response.json();

                setTodoList(data.tasks);
                setIsTodoListLoading(false);
                setFilterError('');
            } catch (error) {
                const isFilterOrSortRequest =
                    debouncedFilterTerm !== '' ||
                    sortBy !== 'createdAt' ||
                    sortDirection !== 'desc';

                if (isFilterOrSortRequest) {
                    setFilterError(
                        `Error filtering/sorting todos: ${error.message}`
                    );
                } else {
                    setError(`Error fetching todos: ${error.message}`);
                }

                setIsTodoListLoading(false);
            }
        }

        if (token) {
            fetchTodos();
        }
    }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

    async function addTodo(todoTitle) {
        const newTodo = {
            id: Date.now(),
            title: todoTitle,
            isCompleted: false,
        };

        setTodoList(currentTodos => [newTodo, ...currentTodos]);
        setIsTodoListLoading(true);
        setError('');
        setFilterError('');

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: todoTitle,
                    isCompleted: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add todo');
            }

            const data = await response.json();

            setTodoList(currentTodos =>
                currentTodos.map(todo =>
                    todo.id === newTodo.id ? data : todo
                )
            );
            setIsTodoListLoading(false);

            invalidateCache();
        } catch (error) {
            setTodoList(currentTodos =>
                currentTodos.filter(todo => todo.id !== newTodo.id)
            );
            setIsTodoListLoading(false);
            setError(`Error: ${error.message}`);
            setFilterError('');
        }
    }

    async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);

        if (!originalTodo) {
            return;
        }

        setTodoList(currentTodos =>
            currentTodos.map(todo =>
                todo.id === id
                    ? { ...todo, isCompleted: true }
                    : todo
            )
        );
        setIsTodoListLoading(true);
        setError('');
        setFilterError('');

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
                body: JSON.stringify({
                    isCompleted: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete todo');
            }

            setIsTodoListLoading(false);

            invalidateCache();
        } catch (error) {
            setTodoList(currentTodos =>
                currentTodos.map(todo =>
                    todo.id === id ? originalTodo : todo
                )
            );
            setIsTodoListLoading(false);
            setError(`Error: ${error.message}`);
            setFilterError('');
        }
    }

    async function updateTodo(editedTodo) {
        const originalTodo = todoList.find(
            todo => todo.id === editedTodo.id
        );

        if (!originalTodo) {
            return;
        }

        setTodoList(currentTodos =>
            currentTodos.map(todo =>
                todo.id === editedTodo.id ? editedTodo : todo
            )
        );
        setIsTodoListLoading(true);
        setError('');
        setFilterError('');

        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: editedTodo.title,
                    isCompleted: editedTodo.isCompleted,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            setIsTodoListLoading(false);

            invalidateCache();
        } catch (error) {
            setTodoList(currentTodos =>
                currentTodos.map(todo =>
                    todo.id === editedTodo.id ? originalTodo : todo
                )
            );
            setIsTodoListLoading(false);
            setError(`Error: ${error.message}`);
            setFilterError('');
        }
    }

    const handleClearError = () => {
        setError('');
    };

    const handleClearFilterError = () => {
        setFilterError('');
    };

    const handleResetFilters = () => {
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
    };

    return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>

                    <button onClick={handleClearError}>
                        Clear Error
                    </button>
                </div>
            )}

            {filterError && (
                <div>
                    <p>{filterError}</p>

                    <button onClick={handleClearFilterError}>
                        Clear Filter Error
                    </button>

                    <button onClick={handleResetFilters}>
                        Reset Filters
                    </button>
                </div>
            )}

            {isTodoListLoading && <p>Loading todos...</p>}

            <SortBy
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortByChange={newSortBy => {
                    setSortBy(newSortBy);
                }}
                onSortDirectionChange={newSortDirection => {
                    setSortDirection(newSortDirection);
                }}
            />

            <FilterInput
                filterTerm={filterTerm}
                onFilterChange={handleFilterChange}
            />

            <TodoForm onAddTodo={addTodo} />

            <TodoList
                todoList={todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                dataVersion={dataVersion}
            />
        </div>
    );
}

export default TodosPage;