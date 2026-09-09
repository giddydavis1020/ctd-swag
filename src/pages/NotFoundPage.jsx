import { Link } from 'react-router';

function NotFoundPage() {
    return (
        <div>
            <h2>404 - Page Not Found</h2>

            <p>
                Sorry, the page you're looking for doesn't exist.
            </p>

            <Link to="/">Go Home</Link>
            {' | '}
            <Link to="/about">About</Link>
            {' | '}
            <Link to="/todos">Todos</Link>
        </div>
    );
}

export default NotFoundPage;