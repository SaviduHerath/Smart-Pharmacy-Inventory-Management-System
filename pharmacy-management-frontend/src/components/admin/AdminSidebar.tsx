import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        ),
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ),
    },
];

export default function AdminSidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col font-sans">
            {/* Logo */}
            <div className="flex h-24 items-center px-8 border-b border-slate-800/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <div className="ml-4">
                    <h1 className="font-bold text-lg text-white tracking-tight">Smart Pharmacy</h1>
                    <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mt-0.5">Admin Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Main Menu
                </p>
                <div className="space-y-1.5">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `group flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`mr-4 transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                        {item.icon}
                                    </div>
                                    {item.name}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 group"
                >
                    <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}

