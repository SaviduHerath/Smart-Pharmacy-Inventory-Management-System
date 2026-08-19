import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {

    const {
        token,
        user,
        isAuthenticated,
    } = useAuth();


    // Not logged in
    if (!isAuthenticated || !token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // User information unavailable
    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // Check role
    if (!allowedRoles.includes(user.role)) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    // Authorized
    return <>{children}</>;
}