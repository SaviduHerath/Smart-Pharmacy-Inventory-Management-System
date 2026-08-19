import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {

    return (
        <div className="min-h-screen bg-slate-50">

            <AdminSidebar />

            <AdminNavbar />

            <main className="ml-64 pt-20">

                <div className="p-8">

                    {/* Welcome */}
                    <div className="mb-8">

                        <h1 className="text-2xl font-bold text-slate-800">
                            Overview
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Here's what's happening in your pharmacy today.
                        </p>

                    </div>


                    {/* Statistics */}
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Total Users"
                            value="--"
                            description="Registered users"
                            icon="👥"
                        />

                        <StatCard
                            title="Medicines"
                            value="--"
                            description="Total medicines"
                            icon="💊"
                        />

                        <StatCard
                            title="Low Stock"
                            value="--"
                            description="Need restocking"
                            icon="⚠️"
                        />

                        <StatCard
                            title="Near Expiry"
                            value="--"
                            description="Expiring soon"
                            icon="⏳"
                        />

                    </div>


                    {/* Quick Actions */}
                    <div className="mt-8 grid gap-6 lg:grid-cols-2">

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-800">
                                Quick Actions
                            </h2>

                            <div className="mt-5 grid grid-cols-2 gap-4">

                                <a
                                    href="/admin/users"
                                    className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
                                >
                                    <div className="text-2xl">
                                        👥
                                    </div>

                                    <p className="mt-2 font-semibold text-slate-800">
                                        Manage Users
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Add and manage staff
                                    </p>
                                </a>


                                <a
                                    href="/admin/medicines"
                                    className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-400 hover:bg-emerald-50"
                                >
                                    <div className="text-2xl">
                                        💊
                                    </div>

                                    <p className="mt-2 font-semibold text-slate-800">
                                        Medicines
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Manage medicine inventory
                                    </p>
                                </a>

                            </div>

                        </div>


                        {/* System Status */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-800">
                                System Status
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Backend API
                                    </span>

                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Online
                                    </span>
                                </div>


                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Database
                                    </span>

                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Connected
                                    </span>
                                </div>


                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Authentication
                                    </span>

                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Active
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

