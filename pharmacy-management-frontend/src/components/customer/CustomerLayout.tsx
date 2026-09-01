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
            isActive ? "text-[#1C2521]" : "text-[#6B7570] hover:text-[#1C2521]"
        } after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#1F6F54] after:transition-transform after:duration-300 ${
            isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
        }`;

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#FBFAF7]">
            <header
                className={`sticky top-0 z-40 border-b transition-all duration-300 ${
                    scrolled
                        ? "border-[#DDE3DE] bg-[#FBFAF7]/90 shadow-sm backdrop-blur-md"
                        : "border-transparent bg-[#FBFAF7]/80 backdrop-blur"
                }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link to="/customer" className="group flex items-center">
                        <div className="relative flex h-11 w-11 items-center justify-center">
                            <span className="absolute inset-0 rounded-md bg-[#1F6F54]/30 anim-spin-slow" />
                            <span className="relative flex h-11 w-11 items-center justify-center rounded-md bg-[#1F6F54] font-display text-xl text-white transition-transform duration-300 group-hover:rotate-6">
                                ℞
                            </span>
                        </div>
                        <div className="ml-3">
                            <h1 className="font-display font-semibold text-[#1C2521]">
                                Smart Pharmacy
                            </h1>
                            <p className="text-xs text-[#6B7570]">Online Pharmacy</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
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

                    <div className="flex items-center gap-3">
                        <Link
                            to="/customer/cart"
                            className="relative rounded-md border border-[#DDE3DE] px-3 py-2 text-sm font-medium text-[#1C2521] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1F6F54]/50"
                        >
                            Cart
                            {cartCount > 0 && (
                                <span
                                    key={cartCount}
                                    className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C08A2E] px-1 text-xs font-semibold text-white"
                                    style={{ animation: "cart-bounce 0.45s ease" }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/customer/profile"
                            className="hidden max-w-36 truncate text-sm text-[#6B7570] transition-colors hover:text-[#1C2521] sm:block"
                        >
                            {user?.fullName}
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="rounded-md px-3 py-2 text-sm font-medium text-[#6B7570] transition-colors hover:bg-[#1C2521]/5 hover:text-[#1C2521]"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div key={location.pathname} className="anim-page">
                {children}
            </div>

            <footer className="mt-10 border-t border-[#DDE3DE] bg-[#FBFAF7]">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <p className="text-center text-sm text-[#6B7570]">
                        © 2026 Smart Pharmacy. Care that arrives on time.
                    </p>
                </div>
            </footer>
        </div>
    );
}
