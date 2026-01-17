import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { userRole, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    // If no user role is set, redirect to login
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    // If roles are restricted and user doesn't match, redirect (maybe to unauthorized or home)
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
