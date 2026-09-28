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
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 flex relative">
            {/* Immersive background image with heavy dark overlay */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity" 
                style={{ backgroundImage: "url('/bg-admin.jpg')" }} 
            />
            <div className="fixed inset-0 z-0 bg-slate-950/80 backdrop-blur-sm" />

            <AdminSidebar />
            
            <main className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden z-10">
                <AdminNavbar />

                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

                <div className="flex-1 p-10 pt-32 relative z-10 overflow-auto">
                    <div className="max-w-7xl mx-auto anim-page">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
                            <p className="mt-2 text-sm font-medium text-slate-400">
                                Live pharmacy system statistics and health overview.
                            </p>
                        </div>
                        
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            <div className="anim-up" style={{ animationDelay: '0.1s' }}>
                                <StatCard title="Total Users" value={value(userCount)} description="Registered users" icon={
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                } />
                            </div>
                            <div className="anim-up" style={{ animationDelay: '0.2s' }}>
                                <StatCard title="Medicines" value={value(medicines)} description="Total in catalog" icon={
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                } />
                            </div>
                            <div className="anim-up" style={{ animationDelay: '0.3s' }}>
                                <StatCard title="Low Stock" value={value(lowStock)} description="Needs attention" icon={
                                    <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                } />
                            </div>
                            <div className="anim-up" style={{ animationDelay: '0.4s' }}>
                                <StatCard title="Orders" value={value(orders)} description="All customer orders" icon={
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                } />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
