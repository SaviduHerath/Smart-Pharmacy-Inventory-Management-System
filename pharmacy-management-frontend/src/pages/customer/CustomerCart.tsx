import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { getApiErrorMessage } from "../../services/api";
import {
    clearCart,
    getCart,
    removeCartItem,
    updateCartItem,
    type Cart,
} from "../../services/cartService";
import { createOrder } from "../../services/orderService";

export default function CustomerCart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setCart(await getCart());
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load cart."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const items = cart?.items || [];

    const handleQty = async (itemId: number, medicineId: number, quantity: number) => {
        if (quantity < 1) return;
        try {
            setCart(await updateCartItem(itemId, medicineId, quantity));
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update item."));
        }
    };

    const handleCheckout = async () => {
        try {
            setPlacing(true);
            setError("");
            await createOrder();
            navigate("/customer/orders", { state: { placed: true } });
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to place order."));
        } finally {
            setPlacing(false);
        }
    };

    return (
        <CustomerLayout>
            <main className="mx-auto max-w-4xl px-6 py-10">
                <p className="anim-up text-sm font-medium uppercase tracking-wide text-[#1F6F54]">
                    Checkout
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl text-[#1C2521]">
                    Your cart
                </h1>

                {error && (
                    <div className="anim-toast mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="mt-8 space-y-4">
                        <div className="skeleton h-24 rounded-2xl" />
                        <div className="skeleton h-24 rounded-2xl" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="anim-scale mt-10 rounded-2xl border border-[#DDE3DE] bg-white p-12 text-center">
                        <p className="anim-float font-display text-5xl">🧺</p>
                        <p className="mt-4 font-display text-2xl">Your basket is empty</p>
                        <p className="mt-2 text-sm text-[#6B7570]">Add a medicine and it will appear here.</p>
                        <Link
                            to="/customer/medicines"
                            className="btn-press mt-6 inline-block rounded-xl bg-[#1F6F54] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Browse medicines
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`anim-slide flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#DDE3DE] bg-white p-5 transition-all duration-300 ${
                                    removingId === item.id ? "translate-x-6 opacity-0" : ""
                                }`}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div>
                                    <p className="font-semibold text-[#1C2521]">{item.medicineName}</p>
                                    <p className="text-sm text-[#6B7570]">
                                        Rs. {Number(item.unitPrice).toFixed(2)} each
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            handleQty(item.id, item.medicineId, item.quantity - 1)
                                        }
                                        className="h-9 w-9 rounded-lg border border-[#DDE3DE] transition hover:bg-[#FBFAF7]"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-6 text-center font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQty(item.id, item.medicineId, item.quantity + 1)
                                        }
                                        className="h-9 w-9 rounded-lg border border-[#DDE3DE] transition hover:bg-[#FBFAF7]"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={async () => {
                                            setRemovingId(item.id);
                                            window.setTimeout(async () => {
                                                setCart(await removeCartItem(item.id));
                                                setRemovingId(null);
                                            }, 280);
                                        }}
                                        className="text-sm text-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="anim-up flex flex-wrap items-center justify-between gap-4 border-t border-[#DDE3DE] pt-6">
                            <p className="font-display text-2xl">
                                Total: Rs. {Number(cart?.total || 0).toFixed(2)}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={async () => setCart(await clearCart())}
                                    className="rounded-xl border border-[#DDE3DE] px-4 py-3 text-sm transition hover:bg-white"
                                >
                                    Clear cart
                                </button>
                                <button
                                    disabled={placing}
                                    onClick={handleCheckout}
                                    className="btn-press rounded-xl bg-[#1F6F54] px-5 py-3 text-sm font-semibold text-white disabled:bg-[#9BB8AD]"
                                >
                                    {placing ? "Placing order..." : "Place order"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </CustomerLayout>
    );
}
