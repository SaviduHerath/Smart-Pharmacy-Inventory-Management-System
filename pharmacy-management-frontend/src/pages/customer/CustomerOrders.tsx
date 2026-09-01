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
                    <div className="anim-toast mb-6 overflow-hidden rounded-2xl bg-[#1F6F54] px-6 py-5 text-white">
                        <p className="font-display text-2xl">Order placed</p>
                        <p className="mt-1 text-sm text-white/80">
                            A pharmacist will review it shortly.
                        </p>
                    </div>
                )}

                <p className="anim-up text-sm font-medium uppercase tracking-wide text-[#1F6F54]">
                    History
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl text-[#1C2521]">
                    My orders
                </h1>

                {error && (
                    <div className="anim-toast mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="mt-8 space-y-5">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="skeleton h-40 rounded-2xl" />
                            <div className="skeleton h-40 rounded-2xl" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="anim-scale rounded-2xl border border-[#DDE3DE] bg-white p-12 text-center">
                            <p className="font-display text-2xl">No orders yet</p>
                            <Link
                                to="/customer/medicines"
                                className="btn-press mt-5 inline-block rounded-xl bg-[#1F6F54] px-5 py-3 text-sm font-semibold text-white"
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
                                    className="stagger-card rounded-2xl border border-[#DDE3DE] bg-white p-6"
                                    style={{ animationDelay: `${index * 90}ms` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-display text-xl">Order #{order.id}</h3>
                                            <p className="text-sm text-[#6B7570]">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-[#1F6F54]/10 px-3 py-1 text-xs font-semibold text-[#1F6F54]">
                                            {order.status}
                                        </span>
                                    </div>

                                    {order.status !== "CANCELLED" && (
                                        <div className="mt-5 flex gap-2">
                                            {steps.map((step, stepIndex) => (
                                                <div key={step} className="flex-1">
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-[#E8E6E0]">
                                                        <div
                                                            className="h-full rounded-full bg-[#1F6F54] transition-all duration-700"
                                                            style={{
                                                                width: stepIndex <= active ? "100%" : "0%",
                                                                transitionDelay: `${stepIndex * 120}ms`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-[10px] uppercase tracking-wide text-[#6B7570]">
                                                        {step.toLowerCase()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <ul className="mt-4 space-y-1 text-sm text-[#6B7570]">
                                        {(order.items || []).map((item) => (
                                            <li key={item.id}>
                                                {item.medicineName} × {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="font-display text-lg">
                                            Rs. {Number(order.totalAmount).toFixed(2)}
                                        </p>
                                        {order.status !== "COMPLETED" &&
                                            order.status !== "CANCELLED" && (
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    className="text-sm font-medium text-red-600"
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
