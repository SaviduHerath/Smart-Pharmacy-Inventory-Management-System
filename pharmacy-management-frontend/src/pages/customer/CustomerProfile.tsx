import { Link } from "react-router-dom";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { useAuth } from "../../context/AuthContext";

export default function CustomerProfile() {
    const { user } = useAuth();
    const initial = (user?.fullName || "C").charAt(0).toUpperCase();

    return (
        <CustomerLayout>
            <main className="mx-auto max-w-3xl px-6 py-12">
                <p className="anim-up text-sm font-medium uppercase tracking-wide text-[#1F6F54]">
                    Account
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl text-[#1C2521]">
                    Your profile
                </h1>

                <div className="anim-scale relative mt-10 overflow-hidden rounded-3xl border border-[#DDE3DE] bg-white p-8">
                    <div
                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#1F6F54]/10"
                        style={{ animation: "blob 11s ease-in-out infinite" }}
                    />
                    <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">
                        <div className="relative">
                            <span
                                className="absolute inset-0 rounded-full border border-[#C08A2E]/40"
                                style={{ animation: "pulse-ring 2.2s ease-out infinite" }}
                            />
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1F6F54] font-display text-4xl text-white">
                                {initial}
                            </div>
                        </div>
                        <div className="mt-5 sm:ml-6 sm:mt-0">
                            <p className="font-display text-3xl">{user?.fullName || "Customer"}</p>
                            <p className="mt-1 text-sm text-[#6B7570]">{user?.email}</p>
                            <span className="mt-3 inline-flex rounded-full bg-[#1F6F54]/10 px-3 py-1 text-xs font-semibold text-[#1F6F54]">
                                {user?.role || "CUSTOMER"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Link
                        to="/customer/medicines"
                        className="hover-lift stagger-card rounded-2xl border border-[#DDE3DE] bg-white p-6"
                    >
                        <p className="font-display text-xl">Continue shopping</p>
                        <p className="mt-2 text-sm text-[#6B7570]">
                            Browse the catalog and refill what you need.
                        </p>
                    </Link>
                    <Link
                        to="/customer/orders"
                        className="hover-lift stagger-card anim-delay-2 rounded-2xl border border-[#DDE3DE] bg-white p-6"
                    >
                        <p className="font-display text-xl">Order timeline</p>
                        <p className="mt-2 text-sm text-[#6B7570]">
                            Watch pending orders move toward completion.
                        </p>
                    </Link>
                </div>
            </main>
        </CustomerLayout>
    );
}
