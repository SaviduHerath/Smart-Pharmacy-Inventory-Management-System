import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/admin",
        icon: "▦",
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: "👥",
    },
];

export default function AdminSidebar() {

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 text-white">

            {/* Logo */}
            <div className="flex h-20 items-center border-b border-slate-800 px-6">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-xl">
                    💊
                </div>

                <div className="ml-3">
                    <h1 className="text-lg font-bold">
                        Smart Pharmacy
                    </h1>

                    <p className="text-xs text-slate-400">
                        Admin Panel
                    </p>
                </div>

            </div>


            {/* Navigation */}
            <nav className="mt-6 px-3">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Main Menu
                </p>

                <div className="space-y-1">

                    {menuItems.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-emerald-500 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >

                            <span className="mr-3 text-lg">
                                {item.icon}
                            </span>

                            {item.name}

                        </NavLink>

                    ))}

                </div>

            </nav>


            {/* Bottom */}
            <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
                >
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}

