import './App.css';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <div>
            <Header />

            {isAuthenticated ? (
                <TodosPage />
            ) : (
                <Logon />
            )}
        </div>
    );
}

export default App;