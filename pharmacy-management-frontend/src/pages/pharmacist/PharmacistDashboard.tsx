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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Welcome back
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Live inventory, expiry, and order status from the backend.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <Stat title="Total Medicines" value={value(summary.totalMedicines)} icon="💊" />
                <Stat title="Low Stock" value={value(summary.lowStock)} icon="⚠️" />
                <Stat title="Near Expiry" value={value(summary.nearExpiry)} icon="⏰" />
                <Stat title="Pending Orders" value={value(pendingOrders)} icon="🛒" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Action to="/pharmacist/medicines" icon="💊" title="Medicines" text="Add and update medicines" />
                        <Action to="/pharmacist/inventory" icon="📦" title="Inventory" text="Stock in and stock out" />
                        <Action to="/pharmacist/suppliers" icon="🏢" title="Suppliers" text="Manage suppliers" />
                        <Action to="/pharmacist/orders" icon="🛒" title="Orders" text="Confirm customer orders" />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800">Alerts</h3>
                    <div className="mt-5 space-y-3">
                        <Alert label="Out of stock" count={summary.outOfStock} />
                        <Alert label="Expired medicines" count={summary.expired} />
                        <Alert label="Low stock" count={summary.lowStock} />
                        <Alert label="Pending orders" count={pendingOrders} />
                    </div>
                </div>
            </div>
        </PharmacistLayout>
    );
}

function Stat({ title, value, icon }: { title: string; value: string | number; icon: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
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
            className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
            <div className="text-xl">{icon}</div>
            <p className="mt-2 font-semibold text-slate-800">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{text}</p>
        </Link>
    );
}

function Alert({ label, count }: { label: string; count: number }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-600">{label}</span>
            <span className="text-sm font-semibold text-slate-800">{count}</span>
        </div>
    );
}
