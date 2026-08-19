
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({
    allowedRoles,
}: ProtectedRouteProps) => {

    const { isAuthenticated, user } = useAuth();

    // User login වෙලා නැත්නම් Login page එකට යවන්න
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Specific roles required නම් check කරන්න
    if (
        allowedRoles &&
        (!user || !allowedRoles.includes(user.role))
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Authorized user → requested page
    return <Outlet />;
};

export default ProtectedRoute;

