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
    const spine = ["#1F6F54", "#C08A2E", "#6B7570", "#1F6F54"];

    return (
        <CustomerLayout>
            <section className="relative overflow-hidden bg-[#FBFAF7]">
                <div
                    className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#1F6F54]/10"
                    style={{ animation: "blob 12s ease-in-out infinite" }}
                />
                <div
                    className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#C08A2E]/10"
                    style={{ animation: "blob 14s ease-in-out infinite reverse" }}
                />

                <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                    <div>
                        <p className="anim-up text-sm text-[#6B7570]">
                            Welcome back{user?.fullName ? `, ${user.fullName}` : ""}
                        </p>
                        <h2 className="anim-up anim-delay-1 font-display mt-4 text-5xl font-semibold leading-[1.05] text-[#1C2521]">
                            Your health,
                            <br />
                            our priority.
                        </h2>
                        <p className="anim-up anim-delay-2 mt-5 max-w-md text-[15px] leading-relaxed text-[#6B7570]">
                            Browse medicines, add them to your cart, and place orders online —
                            filled and ready when you need them.
                        </p>
                        <div className="anim-up anim-delay-3 mt-9 flex flex-wrap gap-4">
                            <Link
                                to="/customer/medicines"
                                className="btn-press rounded-md bg-[#1F6F54] px-6 py-3 text-sm font-medium text-white hover:bg-[#195b45]"
                            >
                                Browse medicines
                            </Link>
                            <Link
                                to="/customer/orders"
                                className="btn-press rounded-md border border-[#1C2521]/15 px-6 py-3 text-sm font-medium text-[#1C2521] hover:border-[#1C2521]/30"
                            >
                                Track my orders
                            </Link>
                        </div>

                        <dl className="anim-up anim-delay-4 mt-10 flex max-w-sm divide-x divide-[#DDE3DE] border-y border-[#DDE3DE] py-4">
                            <div className="pr-6">
                                <dt className="text-xs text-[#6B7570]">Available medicines</dt>
                                <dd className="font-display mt-1 text-2xl text-[#1C2521]">
                                    {loading ? "—" : available.length}
                                </dd>
                            </div>
                            <div className="pl-6">
                                <dt className="text-xs text-[#6B7570]">Categories</dt>
                                <dd className="font-display mt-1 text-2xl text-[#1C2521]">
                                    {loading ? "—" : categories}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="anim-scale relative hidden aspect-[4/5] rounded-lg border border-[#DDE3DE] bg-white md:block">
                        <span className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1F6F54]/20" />
                        <span
                            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C08A2E]/30"
                            style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
                        />
                        <div className="absolute inset-5 rounded border border-dashed border-[#C08A2E]/40" />
                        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                            <span className="anim-float font-display text-8xl text-[#C08A2E]">℞</span>
                            <p className="text-sm text-[#6B7570]">
                                Verified pharmacists review every order before it ships.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { title: "Browse", text: "Search the live catalog", to: "/customer/medicines" },
                        { title: "Cart", text: "Review items before checkout", to: "/customer/cart" },
                        { title: "Orders", text: "Follow status from pending to complete", to: "/customer/orders" },
                    ].map((card, index) => (
                        <Link
                            key={card.title}
                            to={card.to}
                            className="hover-lift stagger-card rounded-2xl border border-[#DDE3DE] bg-white p-6"
                            style={{ animationDelay: `${index * 90}ms` }}
                        >
                            <p className="font-display text-xl text-[#1C2521]">{card.title}</p>
                            <p className="mt-2 text-sm text-[#6B7570]">{card.text}</p>
                            <p className="mt-4 text-sm font-medium text-[#1F6F54]">Open →</p>
                        </Link>
                    ))}
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-14">
                <div className="flex items-baseline justify-between border-b border-[#DDE3DE] pb-4">
                    <h3 className="font-display text-2xl text-[#1C2521]">Featured medicines</h3>
                    <Link
                        to="/customer/medicines"
                        className="text-sm font-medium text-[#1F6F54] transition-colors hover:text-[#195b45]"
                    >
                        View all
                    </Link>
                </div>

                <div className="mt-2 divide-y divide-[#DDE3DE]">
                    {loading &&
                        [1, 2, 3].map((item) => (
                            <div key={item} className="skeleton my-4 h-16 rounded-xl" />
                        ))}

                    {available.slice(0, 4).map((medicine, i) => (
                        <Link
                            key={medicine.id}
                            to="/customer/medicines"
                            className="group flex items-center gap-5 py-5"
                            style={{ animation: "fade-up 0.55s ease both", animationDelay: `${i * 80}ms` }}
                        >
                            <span
                                className="h-10 w-1 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-y-125"
                                style={{ backgroundColor: spine[i % spine.length] }}
                            />
                            <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-[#1C2521] transition-colors group-hover:text-[#1F6F54]">
                                    {medicine.medicineName}
                                </h4>
                                <p className="mt-0.5 text-xs text-[#6B7570]">{medicine.genericName}</p>
                            </div>
                            <p className="font-display text-lg text-[#1C2521]">
                                Rs. {Number(medicine.unitPrice).toFixed(2)}
                            </p>
                        </Link>
                    ))}

                    {!loading && available.length === 0 && (
                        <p className="py-8 text-sm text-[#6B7570]">
                            No medicines in stock right now — check back shortly.
                        </p>
                    )}
                </div>
            </main>
        </CustomerLayout>
    );
}
