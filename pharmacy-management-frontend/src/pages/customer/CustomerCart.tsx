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
                <p className="anim-up text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Checkout
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl font-bold text-white tracking-tight">
                    Your cart
                </h1>

                {error && (
                    <div className="anim-toast mt-4 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 backdrop-blur-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="mt-8 space-y-4">
                        <div className="h-24 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-pulse" />
                        <div className="h-24 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-pulse" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="anim-scale mt-10 flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/30 p-16 text-center backdrop-blur-sm shadow-xl">
                        <div className="anim-float font-display text-6xl mb-6 opacity-80">🧺</div>
                        <p className="font-display text-2xl font-bold text-white tracking-wide">Your basket is empty</p>
                        <p className="mt-2 text-sm text-slate-400 font-medium">Add a medicine and it will appear here.</p>
                        <Link
                            to="/customer/medicines"
                            className="btn-press mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
                        >
                            Browse medicines
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`anim-slide flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-md shadow-lg shadow-black/5 transition-all duration-300 hover:border-emerald-500/30 ${
                                    removingId === item.id ? "translate-x-6 opacity-0" : ""
                                }`}
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                <div>
                                    <p className="font-bold text-slate-200">{item.medicineName}</p>
                                    <p className="text-sm font-medium text-emerald-400 mt-0.5">
                                        Rs. {Number(item.unitPrice).toFixed(2)} each
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center rounded-xl border border-slate-700/50 bg-slate-900/50 p-1">
                                        <button
                                            onClick={() =>
                                                handleQty(item.id, item.medicineId, item.quantity - 1)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                        >
                                            −
                                        </button>
                                        <span className="min-w-8 text-center font-bold text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleQty(item.id, item.medicineId, item.quantity + 1)
                                            }
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            setRemovingId(item.id);
                                            window.setTimeout(async () => {
                                                setCart(await removeCartItem(item.id));
                                                setRemovingId(null);
                                            }, 280);
                                        }}
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="anim-up flex flex-wrap items-center justify-between gap-4 border-t border-slate-700/50 pt-8 mt-8">
                            <div>
                                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Total amount</p>
                                <p className="font-display text-3xl font-bold text-white mt-1">
                                    Rs. {Number(cart?.total || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={async () => setCart(await clearCart())}
                                    className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-5 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                                >
                                    Clear cart
                                </button>
                                <button
                                    disabled={placing}
                                    onClick={handleCheckout}
                                    className="btn-press flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:bg-slate-700/50 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    {placing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                            Placing...
                                        </>
                                    ) : (
                                        "Place order"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </CustomerLayout>
    );
}
