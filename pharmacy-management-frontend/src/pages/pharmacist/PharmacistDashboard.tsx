import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PharmacistLayout from "../../components/pharmacist/PharmacistLayout";
import { getDashboardSummary, type DashboardSummary } from "../../services/medicineService";
import { getAllOrders } from "../../services/orderService";

export default function PharmacistDashboard() {
    const [summary, setSummary] = useState<DashboardSummary>({
        totalMedicines: 0,
        lowStock: 0,
        outOfStock: 0,
        expired: 0,
        nearExpiry: 0,
        totalSuppliers: 0,
    });
    const [pendingOrders, setPendingOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getDashboardSummary(),
            getAllOrders().catch(() => []),
        ])
            .then(([dashboard, orders]) => {
                setSummary(dashboard);
                setPendingOrders(
                    orders.filter((order) => order.status === "PENDING").length
                );
            })
            .finally(() => setLoading(false));
    }, []);

    const value = (n: number) => (loading ? "..." : n);

    return (
        <PharmacistLayout
            title="Pharmacist Dashboard"
            subtitle="Pharmacy overview and daily activities"
        >
            <div className="mb-8 anim-page">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    Welcome back
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-400">
                    Live inventory, expiry, and order status from the backend.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 anim-page" style={{ animationDelay: '0.1s' }}>
                <Stat title="Total Medicines" value={value(summary.totalMedicines)} icon="💊" />
                <Stat title="Low Stock" value={value(summary.lowStock)} icon="⚠️" />
                <Stat title="Near Expiry" value={value(summary.nearExpiry)} icon="⏰" />
                <Stat title="Pending Orders" value={value(pendingOrders)} icon="🛒" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 anim-page" style={{ animationDelay: '0.2s' }}>
                <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl shadow-black/10 backdrop-blur-md">
                    <div className="border-b border-slate-700/50 bg-slate-800/80 px-6 py-5">
                        <h3 className="font-bold text-white tracking-wide">Quick Actions</h3>
                    </div>
                    <div className="p-6 grid gap-4 sm:grid-cols-2">
                        <Action to="/pharmacist/medicines" icon="💊" title="Medicines" text="Add and update medicines" />
                        <Action to="/pharmacist/inventory" icon="📦" title="Inventory" text="Stock in and stock out" />
                        <Action to="/pharmacist/suppliers" icon="🏢" title="Suppliers" text="Manage suppliers" />
                        <Action to="/pharmacist/orders" icon="🛒" title="Orders" text="Confirm customer orders" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-xl shadow-black/10 backdrop-blur-md">
                    <div className="border-b border-slate-700/50 bg-slate-800/80 px-6 py-5">
                        <h3 className="font-bold text-white tracking-wide">Alerts</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <Alert label="Out of stock" count={summary.outOfStock} danger={summary.outOfStock > 0} />
                        <Alert label="Expired medicines" count={summary.expired} danger={summary.expired > 0} />
                        <Alert label="Low stock" count={summary.lowStock} danger={summary.lowStock > 0} warning={summary.lowStock > 0} />
                        <Alert label="Pending orders" count={pendingOrders} action={pendingOrders > 0} />
                    </div>
                </div>
            </div>
        </PharmacistLayout>
    );
}

function Stat({ title, value, icon }: { title: string; value: string | number; icon: string }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl shadow-black/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-emerald-500/30">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl transition-colors group-hover:bg-emerald-500/10"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">{value}</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900/50 border border-slate-700/50 text-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Action({
    to,
    icon,
    title,
    text,
}: {
    to: string;
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <Link
            to={to}
            className="group rounded-xl border border-slate-700/50 bg-slate-900/30 p-5 transition-all hover:border-emerald-500/30 hover:bg-slate-700/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        >
            <div className="flex items-center gap-4 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-xl group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                    {icon}
                </div>
                <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{title}</p>
            </div>
            <p className="text-xs font-medium text-slate-400">{text}</p>
        </Link>
    );
}

function Alert({ label, count, danger, warning, action }: { label: string; count: number; danger?: boolean; warning?: boolean; action?: boolean }) {
    let bgClass = "bg-slate-900/30 border-slate-700/50 text-slate-300";
    let countClass = "bg-slate-800 text-slate-300";

    if (danger) {
        bgClass = "bg-red-500/5 border-red-500/20 text-red-200";
        countClass = "bg-red-500 text-slate-900 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    } else if (warning) {
        bgClass = "bg-amber-500/5 border-amber-500/20 text-amber-200";
        countClass = "bg-amber-500 text-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    } else if (action) {
        bgClass = "bg-emerald-500/5 border-emerald-500/20 text-emerald-200";
        countClass = "bg-emerald-500 text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    }

    return (
        <div className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-colors ${bgClass}`}>
            <span className="text-sm font-semibold">{label}</span>
            <span className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2.5 text-xs font-bold ${countClass}`}>
                {count}
            </span>
        </div>
    );
}
