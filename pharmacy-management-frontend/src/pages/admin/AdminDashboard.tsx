import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";
import { getAllUsers } from "../../services/adminUserService";
import { getDashboardSummary } from "../../services/medicineService";
import { getAllOrders } from "../../services/orderService";

export default function AdminDashboard() {
    const [userCount, setUserCount] = useState(0);
    const [medicines, setMedicines] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [orders, setOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAllUsers(),
            getDashboardSummary().catch(() => null),
            getAllOrders().catch(() => []),
        ])
            .then(([users, summary, orderList]) => {
                setUserCount(users.length);
                if (summary) {
                    setMedicines(summary.totalMedicines);
                    setLowStock(summary.lowStock);
                }
                setOrders(orderList.length);
            })
            .finally(() => setLoading(false));
    }, []);

    const value = (n: number) => (loading ? "..." : n);

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminSidebar />
            <AdminNavbar />
            <main className="ml-64 pt-20">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Live pharmacy system statistics.
                    </p>
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard title="Total Users" value={value(userCount)} description="Registered users" icon="👥" />
                        <StatCard title="Medicines" value={value(medicines)} description="Total medicines" icon="💊" />
                        <StatCard title="Low Stock" value={value(lowStock)} description="Need restocking" icon="⚠️" />
                        <StatCard title="Orders" value={value(orders)} description="All customer orders" icon="🛒" />
                    </div>
                </div>
            </main>
        </div>
    );
}
