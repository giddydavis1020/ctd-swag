import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
    }

    return (
        <button onClick={handleLogout}>
            Log Out
        </button>
    );
}

export default Logoff;