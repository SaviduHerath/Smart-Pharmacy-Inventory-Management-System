import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { getCatalogMedicines, type Medicine } from "../../services/medicineService";
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboard() {
    const { user } = useAuth();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCatalogMedicines()
            .then(setMedicines)
            .catch(() => setMedicines([]))
            .finally(() => setLoading(false));
    }, []);

    const available = medicines.filter((medicine) => medicine.quantity > 0);
    const categories = new Set(medicines.map((medicine) => medicine.category)).size;
    const spine = ["#10B981", "#34D399", "#059669", "#047857"]; // Emerald variants

    return (
        <CustomerLayout>
            <section className="relative overflow-hidden w-full">
                <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:px-10 md:grid-cols-[1.1fr_0.9fr] md:items-center min-h-[500px]">
                    <div className="relative z-10">
                        <div className="anim-up inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ""}
                        </div>
                        
                        <h2 className="anim-up anim-delay-1 mt-6 text-5xl md:text-6xl font-bold leading-tight text-white tracking-tight">
                            Your health,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">our priority.</span>
                        </h2>
                        
                        <p className="anim-up anim-delay-2 mt-5 max-w-md text-base leading-relaxed text-slate-400">
                            Browse essential medicines, manage your prescriptions, and get fast delivery directly to your door — fully verified by our expert pharmacists.
                        </p>
                        
                        <div className="anim-up anim-delay-3 mt-9 flex flex-wrap gap-4">
                            <Link
                                to="/customer/medicines"
                                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5"
                            >
                                Browse Catalog
                            </Link>
                            <Link
                                to="/customer/orders"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-700/50 hover:-translate-y-0.5"
                            >
                                Track Orders
                            </Link>
                        </div>

                        <dl className="anim-up anim-delay-4 mt-12 flex max-w-sm divide-x divide-slate-700/50 border-y border-slate-700/50 py-5">
                            <div className="pr-8">
                                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Medicines</dt>
                                <dd className="mt-2 text-3xl font-bold text-white">
                                    {loading ? <span className="animate-pulse text-slate-700">•••</span> : available.length}
                                </dd>
                            </div>
                            <div className="pl-8">
                                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</dt>
                                <dd className="mt-2 text-3xl font-bold text-white">
                                    {loading ? <span className="animate-pulse text-slate-700">•••</span> : categories}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="anim-scale relative hidden aspect-[4/5] rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl md:block shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5"></div>
                        <span className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/20" />
                        <span
                            className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-500/30"
                            style={{ animation: "pulse-ring 3s ease-out infinite" }}
                        />
                        <div className="absolute inset-6 rounded-2xl border border-dashed border-emerald-500/30" />
                        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-10 text-center z-10">
                            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 anim-float">
                                <span className="font-display text-5xl text-white">℞</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mt-4">Verified Care</h3>
                            <p className="text-sm text-slate-400">
                                Every order is carefully reviewed and approved by our licensed pharmacists before shipping.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 relative z-20 -mt-10">
                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        { title: "Smart Browse", text: "Search our live catalog of verified medicines", to: "/customer/medicines", icon: "🔍" },
                        { title: "Express Cart", text: "Review items before secure checkout", to: "/customer/cart", icon: "🛒" },
                        { title: "Live Orders", text: "Track delivery status in real-time", to: "/customer/orders", icon: "📦" },
                    ].map((card, index) => (
                        <Link
                            key={card.title}
                            to={card.to}
                            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)] anim-up"
                            style={{ animationDelay: `${(index + 1) * 150}ms` }}
                        >
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl transition-colors group-hover:bg-emerald-500/10"></div>
                            
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl border border-slate-700/50 mb-5 group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{card.title}</h3>
                            <p className="mt-2 text-sm text-slate-400">{card.text}</p>
                            
                            <div className="mt-6 flex items-center text-sm font-bold text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                Open App <span className="ml-1">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
                <div className="flex items-end justify-between border-b border-slate-800 pb-5">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Featured Medicines</h3>
                        <p className="mt-1 text-sm text-slate-400">Popular health essentials available now</p>
                    </div>
                    <Link
                        to="/customer/medicines"
                        className="group flex items-center text-sm font-bold text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        View all 
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="mt-4 divide-y divide-slate-800/50">
                    {loading &&
                        [1, 2, 3].map((item) => (
                            <div key={item} className="my-4 h-20 rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/30" />
                        ))}

                    {available.slice(0, 4).map((medicine, i) => (
                        <Link
                            key={medicine.id}
                            to="/customer/medicines"
                            className="group flex items-center gap-6 py-5 transition-colors hover:bg-slate-800/30 -mx-4 px-4 rounded-2xl"
                            style={{ animation: "fade-up 0.5s ease both", animationDelay: `${i * 100}ms` }}
                        >
                            <div 
                                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-inner transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: spine[i % spine.length] }}
                            >
                                {medicine.medicineName.charAt(0).toUpperCase()}
                            </div>
                            
                            <div className="min-w-0 flex-1">
                                <h4 className="text-lg font-bold text-white transition-colors group-hover:text-emerald-400">
                                    {medicine.medicineName}
                                </h4>
                                <p className="mt-1 text-sm text-slate-400">{medicine.genericName}</p>
                            </div>
                            
                            <div className="text-right">
                                <p className="text-xl font-bold text-white">
                                    Rs. {Number(medicine.unitPrice).toFixed(2)}
                                </p>
                                <p className="mt-1 text-xs font-medium text-emerald-400 uppercase tracking-wider">
                                    In Stock
                                </p>
                            </div>
                        </Link>
                    ))}

                    {!loading && available.length === 0 && (
                        <div className="py-12 text-center rounded-2xl border border-slate-800 bg-slate-900/50 mt-4">
                            <div className="text-4xl mb-3">🥺</div>
                            <h4 className="text-lg font-bold text-white mb-1">Catalog Empty</h4>
                            <p className="text-sm text-slate-400">
                                No medicines are currently in stock. Please check back later.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </CustomerLayout>
    );
}
