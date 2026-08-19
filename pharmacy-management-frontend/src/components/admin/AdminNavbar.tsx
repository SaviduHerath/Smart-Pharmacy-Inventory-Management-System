export default function AdminNavbar() {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

            <div className="flex h-full items-center justify-between px-8">

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Admin Dashboard
                    </h2>

                    <p className="text-sm text-slate-500">
                        Manage your pharmacy system
                    </p>
                </div>


                <div className="flex items-center gap-4">

                    <button className="relative rounded-xl p-3 text-slate-500 hover:bg-slate-100">
                        🔔

                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>


                    <div className="flex items-center gap-3 border-l border-slate-200 pl-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                            {user.fullName?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                {user.fullName || "Administrator"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user.role || "ADMIN"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}

