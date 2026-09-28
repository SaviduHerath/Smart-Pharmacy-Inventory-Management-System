import { useEffect, useMemo, useState } from "react";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { getApiErrorMessage } from "../../services/api";
import { addToCart } from "../../services/cartService";
import { getCatalogMedicines, type Medicine } from "../../services/medicineService";

export default function MedicineCatalog() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [addingId, setAddingId] = useState<number | null>(null);

    useEffect(() => {
        getCatalogMedicines()
            .then(setMedicines)
            .catch((err) => setError(getApiErrorMessage(err, "Unable to load medicines.")))
            .finally(() => setLoading(false));
    }, []);

    const categories = useMemo(
        () => [...new Set(medicines.map((medicine) => medicine.category).filter(Boolean))],
        [medicines]
    );

    const filtered = medicines.filter((medicine) => {
        const keyword = search.toLowerCase();
        const matchesSearch =
            medicine.medicineName.toLowerCase().includes(keyword) ||
            medicine.genericName?.toLowerCase().includes(keyword);
        const matchesCategory = category === "ALL" || medicine.category === category;
        return matchesSearch && matchesCategory;
    });

    const handleAdd = async (medicine: Medicine) => {
        try {
            setError("");
            setAddingId(medicine.id);
            await addToCart(medicine.id, 1);
            setMessage(`${medicine.medicineName} floated into your cart.`);
            window.setTimeout(() => setMessage(""), 2400);
        } catch (err) {
            setError(getApiErrorMessage(err, "Could not add to cart."));
        } finally {
            setAddingId(null);
        }
    };

    return (
        <CustomerLayout>
            <section className="relative overflow-hidden border-b border-slate-700/50 bg-slate-900/40 backdrop-blur-sm">
                <div
                    className="pointer-events-none absolute right-10 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
                    style={{ animation: "blob 10s ease-in-out infinite" }}
                />
                <div className="relative mx-auto max-w-7xl px-6 py-12">
                    <p className="anim-up text-sm font-bold uppercase tracking-widest text-emerald-400">
                        Live catalog
                    </p>
                    <h2 className="anim-up anim-delay-1 font-display mt-3 text-4xl font-bold text-white tracking-tight">
                        Find the medicine you need
                    </h2>
                    <p className="anim-up anim-delay-2 mt-3 max-w-xl text-slate-400 font-medium">
                        Search, filter, and add in-stock items. Every card lifts as you browse.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {error && (
                    <div className="anim-toast mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 backdrop-blur-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}
                {message && (
                    <div className="anim-toast mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-400 backdrop-blur-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {message}
                    </div>
                )}

                <div className="anim-up mb-8 flex flex-col gap-4 md:flex-row">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search medicine or generic name..."
                        className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 px-5 py-3.5 text-sm text-slate-200 outline-none backdrop-blur-md transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-500"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-slate-700/50 bg-slate-800/60 px-5 py-3.5 text-sm text-slate-200 outline-none backdrop-blur-md transition focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
                    >
                        <option value="ALL" className="bg-slate-800">All Categories</option>
                        {categories.map((item) => (
                            <option key={item} value={item} className="bg-slate-800">
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="h-72 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="anim-scale flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/30 p-16 text-center backdrop-blur-sm shadow-xl">
                        <div className="text-5xl mb-4 opacity-50">🔍</div>
                        <p className="font-display text-2xl font-bold text-white tracking-wide">Nothing matched</p>
                        <p className="mt-2 text-sm text-slate-400 font-medium">Try another search or category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((medicine, index) => (
                            <div
                                key={medicine.id}
                                className="group hover-lift stagger-card overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-xl shadow-black/10 backdrop-blur-md transition-all hover:border-emerald-500/30 hover:bg-slate-800/60"
                                style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
                            >
                                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-slate-900/50 border border-slate-700/30 group-hover:bg-slate-900/80 transition-colors">
                                    <span className="anim-float font-display text-5xl">
                                        💊
                                    </span>
                                </div>
                                <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{medicine.medicineName}</h3>
                                <p className="mt-1 text-xs font-medium text-slate-400">{medicine.genericName}</p>
                                <p className="mt-4 font-display text-xl font-bold text-emerald-300">
                                    Rs. {Number(medicine.unitPrice).toFixed(2)}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                    {medicine.quantity} units available
                                </p>
                                <button
                                    disabled={medicine.quantity === 0 || addingId === medicine.id}
                                    onClick={() => handleAdd(medicine)}
                                    className="btn-press mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:bg-slate-700/50 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    {medicine.quantity === 0
                                        ? "Out of Stock"
                                        : addingId === medicine.id
                                          ? "Adding..."
                                          : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                Add to Cart
                                            </>
                                          )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </CustomerLayout>
    );
}
