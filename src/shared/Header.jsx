import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
    const { isAuthenticated } = useAuth();

    return <h1>Todo List</h1>;
}

export default Header;