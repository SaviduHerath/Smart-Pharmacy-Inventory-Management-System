import { Routes, Route, Navigate } from "react-router-dom";

import UserManagement from "./pages/admin/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import SupplierManagement from "./pages/pharmacist/SupplierManagement";
import Inventory from "./pages/pharmacist/Inventory";
import PharmacistOrders from "./pages/pharmacist/PharmacistOrders";
import MedicineManagement from "./pages/pharmacist/MedicineManagement";
import MedicineCatalog from "./pages/customer/MedicineCatalog";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerCart from "./pages/customer/CustomerCart";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerProfile from "./pages/customer/CustomerProfile";

const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold">403</h1>
            <p className="text-gray-600 mt-2">
                You are not authorized to access this page.
            </p>
        </div>
    </div>
);

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <UserManagement />
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
                path="/pharmacist/orders"
                element={
                    <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                        <PharmacistOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pharmacist/medicines"
                element={
                    <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                        <MedicineManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/pharmacist/suppliers"
                element={
                    <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                        <SupplierManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/customer"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer/medicines"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <MedicineCatalog />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer/cart"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <CustomerCart />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer/orders"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <CustomerOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer/profile"
                element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                        <CustomerProfile />
                    </ProtectedRoute>
                }
            />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
