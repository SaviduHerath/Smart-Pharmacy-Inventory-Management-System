import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

const AdminDashboard = () => (
    <div className="p-8 text-2xl font-bold">
        Admin Dashboard
    </div>
);

const PharmacistDashboard = () => (
    <div className="p-8 text-2xl font-bold">
        Pharmacist Dashboard
    </div>
);

const CustomerDashboard = () => (
    <div className="p-8 text-2xl font-bold">
        Customer Dashboard
    </div>
);

const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold">
                403
            </h1>

            <p className="text-gray-600 mt-2">
                You are not authorized to access this page.
            </p>
        </div>
    </div>
);

function App() {

    return (
        <Routes>

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Admin */}
            <Route element={
                <ProtectedRoute
                    allowedRoles={["ADMIN"]}
                />
            }>
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />
            </Route>


            {/* Pharmacist */}
            <Route element={
                <ProtectedRoute
                    allowedRoles={["PHARMACIST"]}
                />
            }>
                <Route
                    path="/pharmacist"
                    element={<PharmacistDashboard />}
                />
            </Route>


            {/* Customer */}
            <Route element={
                <ProtectedRoute
                    allowedRoles={["CUSTOMER"]}
                />
            }>
                <Route
                    path="/customer"
                    element={<CustomerDashboard />}
                />
            </Route>


            {/* Unauthorized */}
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* Default */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;

