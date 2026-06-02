import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
    const userString = localStorage.getItem('udlaeats_user');

    if (!userString) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(userString);

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}