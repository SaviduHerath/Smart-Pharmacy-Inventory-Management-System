import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
    { name: "Dashboard", path: "/pharmacist", icon: "▦", end: true },
    { name: "Medicines", path: "/pharmacist/medicines", icon: "💊" },
    { name: "Suppliers", path: "/pharmacist/suppliers", icon: "🏢" },
    { name: "Inventory", path: "/pharmacist/inventory", icon: "📦" },
    { name: "Orders", path: "/pharmacist/orders", icon: "🛒" },
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
        <div className="min-h-screen bg-slate-50">
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 text-white">
                <div className="flex h-20 items-center border-b border-slate-800 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl">
                        💊
                    </div>
                    <div className="ml-3">
                        <h1 className="font-bold">Smart Pharmacy</h1>
                        <p className="text-xs text-slate-400">Pharmacist Panel</p>
                    </div>
                </div>

                <nav className="mt-6 px-3">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `mb-1 flex rounded-xl px-4 py-3 text-sm transition ${
                                    isActive
                                        ? "bg-emerald-500 font-medium text-white"
                                        : "text-slate-300 hover:bg-slate-800"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        🚪
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="ml-64">
                <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">
                    <div className="flex h-full items-center justify-between px-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                            {subtitle && (
                                <p className="text-sm text-slate-500">{subtitle}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {action}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-800">
                                        {user?.fullName || "Pharmacist"}
                                    </p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                    {(user?.fullName || "P").charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="pt-20">
                    <div className="p-8">{children}</div>
                </div>
            </main>
        </div>
    );
}
