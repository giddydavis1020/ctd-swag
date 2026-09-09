import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [logoutError, setLogoutError] = useState('');

    async function handleLogout() {
        setLogoutError('');

        const result = await logout();

        if (result.success) {
            navigate('/login');
        } else {
            setLogoutError(result.error);
        }
    }

    return (
        <div>
            {logoutError && <p>{logoutError}</p>}
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
}

export default Logoff;