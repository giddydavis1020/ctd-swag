import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isLoggingOn, setIsLoggingOn] = useState(false);

    const from = location.state?.from || {
        pathname: '/todos',
        search: '',
        hash: '',
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate(
                `${from.pathname}${from.search || ''}${from.hash || ''}`,
                { replace: true }
            );
        }
    }, [isAuthenticated, navigate, from]);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        const result = await login(email, password);

        if (!result.success) {
            setAuthError(result.error);
            setIsLoggingOn(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {authError && <p>{authError}</p>}

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={isLoggingOn}>
                {isLoggingOn ? 'Logging in...' : 'Log On'}
            </button>
        </form>
    );
}

export default LoginPage;