import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import UserManagement from "./pages/admin/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PharmacistDashboard
    from "./pages/pharmacist/PharmacistDashboard";


import Inventory from "./pages/pharmacist/Inventory";

import Prescriptions from "./pages/pharmacist/Prescriptions";
import MedicineManagement
    from "./pages/pharmacist/MedicineManagement";




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

            {/* ================= PUBLIC ================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ================= ADMIN ================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    >
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute
                        allowedRoles={["ADMIN"]}
                    >
                        <UserManagement />
                    </ProtectedRoute>
                }
            />


            {/* ================= PHARMACIST ================= */}

            <Route
                path="/pharmacist"
                element={
                    <ProtectedRoute
                        allowedRoles={["PHARMACIST"]}
                    >
                        <PharmacistDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                    path="/pharmacist"
                    element={
                        <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                            <PharmacistDashboard />
                        </ProtectedRoute>
                    }
                />

                

                <Route
                    path="/pharmacist/inventory"
                    element={
                        <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                            <Inventory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/pharmacist/prescriptions"
                    element={
                        <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                            <Prescriptions />
                        </ProtectedRoute>
                    }
                />

                
                <Route
                    path="/pharmacist/medicines"
                    element={
                        <ProtectedRoute
                            allowedRoles={["PHARMACIST"]}
                        >
                            <MedicineManagement />
                        </ProtectedRoute>
                    }
                />



            {/* ================= CUSTOMER ================= */}

            <Route
                path="/customer"
                element={
                    <ProtectedRoute
                        allowedRoles={["CUSTOMER"]}
                    >
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />


            {/* ================= UNAUTHORIZED ================= */}

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />


            {/* ================= DEFAULT ================= */}

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