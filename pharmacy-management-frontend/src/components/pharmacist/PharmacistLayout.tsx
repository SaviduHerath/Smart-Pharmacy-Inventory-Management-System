import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
    { name: "Dashboard", path: "/pharmacist", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    ), end: true },
    { name: "Medicines", path: "/pharmacist/medicines", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ) },
    { name: "Suppliers", path: "/pharmacist/suppliers", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ) },
    { name: "Inventory", path: "/pharmacist/inventory", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ) },
    { name: "Orders", path: "/pharmacist/orders", icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    ) },
];

interface PharmacistLayoutProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    children: ReactNode;
}

export default function PharmacistLayout({
    title,
    subtitle,
    action,
    children,
}: PharmacistLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500/30 flex relative">
            {/* Immersive background image with heavy dark overlay */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-luminosity" 
                style={{ backgroundImage: "url('/bg-admin.jpg')" }} 
            />
            <div className="fixed inset-0 z-0 bg-slate-950/80 backdrop-blur-sm" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-slate-950/60 backdrop-blur-xl border-r border-slate-800/50 flex flex-col">
                <div className="flex h-24 items-center px-8 border-b border-slate-800/50 relative z-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <h1 className="font-bold text-lg text-white tracking-tight">Smart Pharmacy</h1>
                        <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mt-0.5">Pharmacist</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
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
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-medium text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 group"
                    >
                        <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <header className="sticky top-0 z-30 h-24 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
                    <div className="flex h-full items-center justify-between px-10">
                        <div className="anim-up">
                            <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                            {subtitle && (
                                <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-6 anim-up" style={{ animationDelay: '0.1s' }}>
                            {action && <div className="mr-2">{action}</div>}
                            
                            <div className="flex items-center gap-4 pl-6 border-l border-slate-800/80">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-slate-200">
                                        {user?.fullName || "Pharmacist"}
                                    </p>
                                    <p className="text-xs font-medium text-emerald-400">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold shadow-inner">
                                    {(user?.fullName || "P").charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-10 relative z-10 overflow-auto">
                    <div className="max-w-7xl mx-auto anim-page">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
