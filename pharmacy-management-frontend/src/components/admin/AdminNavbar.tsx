export default function AdminNavbar() {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (
        <header className="fixed left-72 right-0 top-0 z-30 h-24 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl transition-all duration-300">
            <div className="flex h-full items-center justify-between px-10">
                <div className="anim-up">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Admin Dashboard
                    </h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                        Manage your pharmacy system
                    </p>
                </div>

                <div className="flex items-center gap-6 anim-up" style={{ animationDelay: '0.1s' }}>
                    <button className="relative rounded-full p-2.5 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-emerald-400 group">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </button>

                    <div className="flex items-center gap-4 pl-6 border-l border-slate-800/80">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-200">
                                {user.fullName || "Administrator"}
                            </p>
                            <p className="text-xs font-medium text-emerald-400">
                                {user.role || "ADMIN"}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold text-emerald-400 shadow-inner">
                            {user.fullName?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

