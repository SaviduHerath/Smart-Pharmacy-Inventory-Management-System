import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { getApiErrorMessage } from "../../services/api";
import { cancelOrder, getMyOrders, type Order } from "../../services/orderService";

const steps = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED"];

export default function CustomerOrders() {
    const location = useLocation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [celebrating, setCelebrating] = useState(
        Boolean((location.state as { placed?: boolean } | null)?.placed)
    );

    const load = async () => {
        try {
            setLoading(true);
            setOrders(await getMyOrders());
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load orders."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (!celebrating) return;
        const timer = window.setTimeout(() => setCelebrating(false), 2800);
        return () => window.clearTimeout(timer);
    }, [celebrating]);

    const handleCancel = async (id: number) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            await cancelOrder(id);
            await load();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to cancel order."));
        }
    };

    const statusIndex = (status: string) => {
        if (status === "CANCELLED") return -1;
        const index = steps.indexOf(status);
        return index === -1 ? 0 : index;
    };

    return (
        <CustomerLayout>
            <main className="relative mx-auto max-w-4xl overflow-hidden px-6 py-10">
                {celebrating && (
                    <div className="anim-toast mb-6 overflow-hidden rounded-2xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md px-6 py-5 text-emerald-200">
                        <p className="font-display text-2xl font-bold text-white">Order placed</p>
                        <p className="mt-1 text-sm font-medium">
                            A pharmacist will review it shortly.
                        </p>
                    </div>
                )}

                <p className="anim-up text-sm font-bold uppercase tracking-widest text-emerald-400">
                    History
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl font-bold text-white tracking-tight">
                    My orders
                </h1>

                {error && (
                    <div className="anim-toast mt-4 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 backdrop-blur-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <div className="mt-8 space-y-6">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-40 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-pulse" />
                            <div className="h-40 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-pulse" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="anim-scale flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/30 p-16 text-center backdrop-blur-sm shadow-xl">
                            <div className="anim-float font-display text-6xl mb-6 opacity-80">📦</div>
                            <p className="font-display text-2xl font-bold text-white tracking-wide">No orders yet</p>
                            <Link
                                to="/customer/medicines"
                                className="btn-press mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                            >
                                Start shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order, index) => {
                            const active = statusIndex(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="stagger-card rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md shadow-lg shadow-black/5 hover:border-emerald-500/30 transition-colors"
                                    style={{ animationDelay: `${index * 90}ms` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-display text-xl font-bold text-white">Order #{order.id}</h3>
                                            <p className="text-sm font-medium text-slate-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                                            order.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border border-red-500/20" : 
                                            order.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${order.status === "CANCELLED" ? "bg-red-400" : order.status === "COMPLETED" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                                            {order.status}
                                        </span>
                                    </div>

                                    {order.status !== "CANCELLED" && (
                                        <div className="mt-6 flex gap-2">
                                            {steps.map((step, stepIndex) => (
                                                <div key={step} className="flex-1">
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/50">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-700"
                                                            style={{
                                                                width: stepIndex <= active ? "100%" : "0%",
                                                                transitionDelay: `${stepIndex * 120}ms`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                        {step.toLowerCase()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <ul className="mt-5 space-y-2 text-sm font-medium text-slate-300 bg-slate-900/30 rounded-xl p-4 border border-slate-700/30">
                                        {(order.items || []).map((item) => (
                                            <li key={item.id} className="flex justify-between">
                                                <span>{item.medicineName}</span>
                                                <span className="text-slate-500">× {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 flex items-center justify-between">
                                        <p className="font-display text-xl font-bold text-emerald-400">
                                            Rs. {Number(order.totalAmount).toFixed(2)}
                                        </p>
                                        {order.status !== "COMPLETED" &&
                                            order.status !== "CANCELLED" && (
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    className="rounded-lg px-4 py-2.5 text-sm font-semibold text-red-400 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                                                >
                                                    Cancel order
                                                </button>
                                            )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </CustomerLayout>
    );
}
