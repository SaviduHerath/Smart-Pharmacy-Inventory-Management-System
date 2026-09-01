import { useEffect, useState } from "react";
import PharmacistLayout from "../../components/pharmacist/PharmacistLayout";
import { getApiErrorMessage } from "../../services/api";
import {
    getAllOrders,
    updateOrderStatus,
    type Order,
    type OrderStatus,
} from "../../services/orderService";

const statuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
];

export default function PharmacistOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            setLoading(true);
            setError("");
            setOrders(await getAllOrders());
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load orders."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleStatus = async (id: number, status: OrderStatus) => {
        try {
            await updateOrderStatus(id, status);
            await load();
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update order."));
        }
    };

    const visible =
        filter === "ALL"
            ? orders
            : orders.filter((order) => order.status === filter);

    return (
        <PharmacistLayout
            title="Customer Orders"
            subtitle="Review and update order status"
        >
            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as OrderStatus | "ALL")}
                className="mb-6 rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
                <option value="ALL">All statuses</option>
                {statuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <div className="space-y-4">
                {loading ? (
                    <p className="text-sm text-slate-500">Loading orders...</p>
                ) : visible.length === 0 ? (
                    <p className="text-sm text-slate-500">No orders found.</p>
                ) : (
                    visible.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-slate-800">
                                        Order #{order.id}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {order.userName} · {order.userEmail}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">
                                        Rs. {Number(order.totalAmount).toFixed(2)}
                                    </p>
                                    <select
                                        value={order.status}
                                        disabled={
                                            order.status === "COMPLETED" ||
                                            order.status === "CANCELLED"
                                        }
                                        onChange={(e) =>
                                            handleStatus(
                                                order.id,
                                                e.target.value as OrderStatus
                                            )
                                        }
                                        className="mt-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <ul className="mt-4 space-y-1 text-sm text-slate-600">
                                {(order.items || []).map((item) => (
                                    <li key={item.id}>
                                        {item.medicineName} × {item.quantity} — Rs.{" "}
                                        {Number(item.subtotal).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </PharmacistLayout>
    );
}
