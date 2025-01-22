import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if there's no token
        return <Navigate to="/login" replace />;
    }

    // If there is a token, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
