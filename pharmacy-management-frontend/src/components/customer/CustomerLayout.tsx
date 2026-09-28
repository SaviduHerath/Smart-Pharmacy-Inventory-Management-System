import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCart } from "../../services/cartService";

interface CustomerLayoutProps {
    children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [cartCount, setCartCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        getCart()
            .then((cart) =>
                setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0))
            )
            .catch(() => setCartCount(0));
    }, [location.pathname, location.key]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `relative pb-1 text-sm font-medium transition-colors duration-300 ${
            isActive ? "text-emerald-400" : "text-slate-400 hover:text-emerald-300"
        } after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-emerald-400 after:transition-transform after:duration-300 ${
            isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
        }`;

    return (
        <div className="min-h-screen overflow-x-hidden text-slate-100 font-sans selection:bg-teal-500/30 flex flex-col relative bg-slate-950">
            {/* Immersive background image with heavy dark overlay */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity" 
                style={{ backgroundImage: "url('/bg-customer.jpg')" }} 
            />
            <div className="fixed inset-0 z-0 bg-slate-950/80 backdrop-blur-[2px]" />

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-0 -ml-40 -mt-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <header
                className={`sticky top-0 z-40 border-b transition-all duration-300 ${
                    scrolled
                        ? "border-slate-800/50 bg-slate-900/60 shadow-lg shadow-black/20 backdrop-blur-xl py-3"
                        : "border-transparent bg-transparent py-5"
                }`}
            >
                <div className="mx-auto flex items-center justify-between px-6 lg:px-10 max-w-7xl">
                    <Link to="/customer" className="group flex items-center anim-up">
                        <div className="relative flex h-12 w-12 items-center justify-center">
                            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex h-12 w-12 items-center justify-center font-display text-2xl text-white transition-transform duration-300 group-hover:scale-110">
                                ℞
                            </span>
                        </div>
                        <div className="ml-4">
                            <h1 className="font-bold text-lg text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                                Smart Pharmacy
                            </h1>
                            <p className="text-xs font-medium text-emerald-400/80 uppercase tracking-widest mt-0.5">Online Store</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex anim-up" style={{ animationDelay: '0.1s' }}>
                        <NavLink to="/customer" end className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/customer/medicines" className={linkClass}>
                            Medicines
                        </NavLink>
                        <NavLink to="/customer/cart" className={linkClass}>
                            Cart
                        </NavLink>
                        <NavLink to="/customer/orders" className={linkClass}>
                            My Orders
                        </NavLink>
                        <NavLink to="/customer/profile" className={linkClass}>
                            Profile
                        </NavLink>
                    </nav>

                    <div className="flex items-center gap-4 anim-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to="/customer/cart"
                            className="relative flex items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/50 p-2.5 text-emerald-400 transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-700/50 hover:text-emerald-300"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span
                                    key={cartCount}
                                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ animation: "cart-bounce 0.45s ease" }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        
                        <div className="h-8 w-px bg-slate-700/50 hidden sm:block"></div>

                        <Link
                            to="/customer/profile"
                            className="hidden max-w-[150px] truncate text-sm font-medium text-slate-300 transition-colors hover:text-emerald-400 sm:block"
                        >
                            {user?.fullName}
                        </Link>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 group"
                        >
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative z-10 w-full">
                <div key={location.pathname} className="anim-page h-full">
                    {children}
                </div>
            </main>

            <footer className="mt-16 border-t border-slate-800/50 bg-slate-900/50 relative z-10">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <p className="text-center text-sm font-medium text-slate-500">
                        © 2026 Smart Pharmacy. Premium care that arrives on time.
                    </p>
                </div>
            </footer>
        </div>
    );
}
