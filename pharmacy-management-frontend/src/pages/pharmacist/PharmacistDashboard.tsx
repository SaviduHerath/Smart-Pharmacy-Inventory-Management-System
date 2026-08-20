import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PharmacistDashboard() {

    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ================= SIDEBAR ================= */}

            <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-white">

                {/* Logo */}

                <div className="flex h-20 items-center border-b border-slate-800 px-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl">
                        💊
                    </div>

                    <div className="ml-3">

                        <h1 className="font-bold">
                            Smart Pharmacy
                        </h1>

                        <p className="text-xs text-slate-400">
                            Pharmacist Panel
                        </p>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="mt-6 px-3">

                    <Link
                        to="/pharmacist"
                        className="mb-1 flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium"
                    >
                        ▦
                        <span className="ml-3">
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/pharmacist/medicines"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    >
                        💊
                        <span className="ml-3">
                            Medicines
                        </span>
                    </Link>


                    <Link
                        to="/pharmacist/inventory"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    >
                        📦
                        <span className="ml-3">
                            Inventory
                        </span>
                    </Link>


                    <Link
                        to="/pharmacist/prescriptions"
                        className="mb-1 flex rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
                    >
                        📋
                        <span className="ml-3">
                            Prescriptions
                        </span>
                    </Link>

                </nav>


                {/* Logout */}

                <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">

                    <button
                        onClick={logout}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        🚪
                        <span className="ml-3">
                            Logout
                        </span>
                    </button>

                </div>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="ml-64">

                {/* Navbar */}

                <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

                    <div className="flex h-full items-center justify-between px-8">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Pharmacist Dashboard
                            </h2>

                            <p className="text-sm text-slate-500">
                                Pharmacy overview and daily activities
                            </p>

                        </div>


                        {/* User */}

                        <div className="flex items-center gap-3">

                            <div className="text-right">

                                <p className="text-sm font-semibold text-slate-800">
                                    {user?.fullName || "Pharmacist"}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {user?.email}
                                </p>

                            </div>


                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                {(user?.fullName || "P")
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                        </div>

                    </div>

                </header>


                {/* Content */}

                <div className="pt-20">

                    <div className="p-8">

                        {/* Welcome */}

                        <div className="mb-8">

                            <h1 className="text-2xl font-bold text-slate-800">
                                Welcome back,{" "}
                                {user?.fullName || "Pharmacist"} 👋
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Here is what's happening in your pharmacy today.
                            </p>

                        </div>


                        {/* ================= STAT CARDS ================= */}

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                            {/* Medicines */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Total Medicines
                                        </p>

                                        <h3 className="mt-2 text-3xl font-bold text-slate-800">
                                            0
                                        </h3>

                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                                        💊
                                    </div>

                                </div>

                            </div>


                            {/* Low Stock */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Low Stock
                                        </p>

                                        <h3 className="mt-2 text-3xl font-bold text-slate-800">
                                            0
                                        </h3>

                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">
                                        ⚠️
                                    </div>

                                </div>

                            </div>


                            {/* Expiring */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Expiring Soon
                                        </p>

                                        <h3 className="mt-2 text-3xl font-bold text-slate-800">
                                            0
                                        </h3>

                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
                                        ⏰
                                    </div>

                                </div>

                            </div>


                            {/* Prescriptions */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Pending Prescriptions
                                        </p>

                                        <h3 className="mt-2 text-3xl font-bold text-slate-800">
                                            0
                                        </h3>

                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                        📋
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ================= QUICK ACTIONS ================= */}

                        <div className="mt-8 grid gap-6 lg:grid-cols-2">

                            {/* Quick Actions */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <h3 className="text-lg font-bold text-slate-800">
                                    Quick Actions
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Frequently used pharmacy functions
                                </p>


                                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                    <Link
                                        to="/pharmacist/medicines"
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                                    >

                                        <div className="text-xl">
                                            💊
                                        </div>

                                        <p className="mt-2 font-semibold text-slate-800">
                                            Medicines
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Manage medicines
                                        </p>

                                    </Link>


                                    <Link
                                        to="/pharmacist/inventory"
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                                    >

                                        <div className="text-xl">
                                            📦
                                        </div>

                                        <p className="mt-2 font-semibold text-slate-800">
                                            Inventory
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Manage stock
                                        </p>

                                    </Link>


                                    <Link
                                        to="/pharmacist/prescriptions"
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                                    >

                                        <div className="text-xl">
                                            📋
                                        </div>

                                        <p className="mt-2 font-semibold text-slate-800">
                                            Prescriptions
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Review prescriptions
                                        </p>

                                    </Link>

                                </div>

                            </div>


                            {/* Alerts */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <h3 className="text-lg font-bold text-slate-800">
                                    Alerts
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Important pharmacy notifications
                                </p>


                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">

                                    <div className="text-3xl">
                                        🔔
                                    </div>

                                    <p className="mt-2 font-medium text-slate-700">
                                        No alerts
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Everything looks good for now.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}