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
            <section className="relative overflow-hidden border-b border-[#DDE3DE] bg-[#FBFAF7]">
                <div
                    className="pointer-events-none absolute right-10 top-0 h-40 w-40 rounded-full bg-[#1F6F54]/10"
                    style={{ animation: "blob 10s ease-in-out infinite" }}
                />
                <div className="relative mx-auto max-w-7xl px-6 py-12">
                    <p className="anim-up text-sm font-medium uppercase tracking-wide text-[#1F6F54]">
                        Live catalog
                    </p>
                    <h2 className="anim-up anim-delay-1 font-display mt-3 text-4xl font-semibold text-[#1C2521]">
                        Find the medicine you need
                    </h2>
                    <p className="anim-up anim-delay-2 mt-3 max-w-xl text-[#6B7570]">
                        Search, filter, and add in-stock items. Every card lifts as you browse.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {error && (
                    <div className="anim-toast mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="anim-toast mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {message}
                    </div>
                )}

                <div className="anim-up mb-8 flex flex-col gap-4 md:flex-row">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search medicine or generic name..."
                        className="w-full rounded-xl border border-[#DDE3DE] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F6F54] focus:ring-4 focus:ring-[#1F6F54]/10"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-[#DDE3DE] bg-white px-4 py-3 text-sm outline-none focus:border-[#1F6F54]"
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="skeleton h-72 rounded-2xl" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="anim-scale rounded-2xl border border-[#DDE3DE] bg-white p-16 text-center">
                        <p className="font-display text-2xl">Nothing matched</p>
                        <p className="mt-2 text-sm text-[#6B7570]">Try another search or category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((medicine, index) => (
                            <div
                                key={medicine.id}
                                className="hover-lift stagger-card overflow-hidden rounded-2xl border border-[#DDE3DE] bg-white p-5"
                                style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
                            >
                                <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-[#1F6F54]/8">
                                    <span className="anim-float font-display text-4xl text-[#1F6F54]">
                                        💊
                                    </span>
                                </div>
                                <h3 className="font-semibold text-[#1C2521]">{medicine.medicineName}</h3>
                                <p className="mt-1 text-xs text-[#6B7570]">{medicine.genericName}</p>
                                <p className="mt-4 font-display text-lg">
                                    Rs. {Number(medicine.unitPrice).toFixed(2)}
                                </p>
                                <p className="mt-1 text-xs text-[#6B7570]">
                                    {medicine.quantity} units available
                                </p>
                                <button
                                    disabled={medicine.quantity === 0 || addingId === medicine.id}
                                    onClick={() => handleAdd(medicine)}
                                    className="btn-press mt-5 w-full rounded-xl bg-[#1F6F54] px-4 py-3 text-sm font-semibold text-white disabled:bg-[#E8E6E0] disabled:text-[#6B7570]"
                                >
                                    {medicine.quantity === 0
                                        ? "Out of Stock"
                                        : addingId === medicine.id
                                          ? "Adding..."
                                          : "Add to Cart"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </CustomerLayout>
    );
}
