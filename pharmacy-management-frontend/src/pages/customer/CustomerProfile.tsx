import { Link } from "react-router-dom";
import CustomerLayout from "../../components/customer/CustomerLayout";
import { useAuth } from "../../context/AuthContext";

export default function CustomerProfile() {
    const { user } = useAuth();
    const initial = (user?.fullName || "C").charAt(0).toUpperCase();

    return (
        <CustomerLayout>
            <main className="mx-auto max-w-3xl px-6 py-12">
                <p className="anim-up text-sm font-bold uppercase tracking-widest text-emerald-400">
                    Account
                </p>
                <h1 className="anim-up anim-delay-1 font-display mt-2 text-4xl font-bold text-white tracking-tight">
                    Your profile
                </h1>

                <div className="anim-scale relative mt-10 overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/40 p-8 shadow-xl shadow-black/10 backdrop-blur-md">
                    <div
                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
                        style={{ animation: "blob 11s ease-in-out infinite" }}
                    />
                    <div className="relative flex flex-col items-center text-center sm:flex-row sm:text-left">
                        <div className="relative">
                            <span
                                className="absolute inset-0 rounded-full border border-emerald-500/40"
                                style={{ animation: "pulse-ring 2.2s ease-out infinite" }}
                            />
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 font-display text-4xl font-bold text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                {initial}
                            </div>
                        </div>
                        <div className="mt-6 sm:ml-8 sm:mt-0">
                            <p className="font-display text-3xl font-bold text-white">{user?.fullName || "Customer"}</p>
                            <p className="mt-1 text-sm font-medium text-slate-400">{user?.email}</p>
                            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                {user?.role || "CUSTOMER"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Link
                        to="/customer/medicines"
                        className="group hover-lift stagger-card rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md shadow-lg shadow-black/5 transition-all hover:border-emerald-500/30 hover:bg-slate-800/60"
                    >
                        <p className="font-display text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Continue shopping</p>
                        <p className="mt-2 text-sm font-medium text-slate-400">
                            Browse the catalog and refill what you need.
                        </p>
                    </Link>
                    <Link
                        to="/customer/orders"
                        className="group hover-lift stagger-card anim-delay-2 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md shadow-lg shadow-black/5 transition-all hover:border-emerald-500/30 hover:bg-slate-800/60"
                    >
                        <p className="font-display text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Order timeline</p>
                        <p className="mt-2 text-sm font-medium text-slate-400">
                            Watch pending orders move toward completion.
                        </p>
                    </Link>
                </div>
            </main>
        </CustomerLayout>
    );
}
