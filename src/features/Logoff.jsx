import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
    const { logout } = useAuth();
    const [logoutError, setLogoutError] = useState('');

    async function handleLogout() {
        setLogoutError('');

        const result = await logout();

        if (!result.success) {
            setLogoutError(result.error);
        }
    }

    return (
        <div>
            {logoutError && <p>{logoutError}</p>}

            <button onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default Logoff;