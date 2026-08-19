import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate= useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

   



    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {

            setLoading(true);

             interface JwtPayload {
                    sub?: string;
                    email?: string;
                    role?: string;
                    exp?: number;
                }


            
                const response = await loginUser({
                    email,
                    password,
                });

                const decoded = jwtDecode<JwtPayload>(
                    response.token
                );

                const user = {
                    email: decoded.email || email,
                    role: decoded.role || "CUSTOMER",
                };

                login(
                    response.token,
                    user
                );

                // Role අනුව redirect
                switch (user.role) {

                    case "ADMIN":
                        navigate("/admin");
                        break;

                    case "PHARMACIST":
                        navigate("/pharmacist");
                        break;

                    case "CUSTOMER":
                        navigate("/customer");
                        break;

                    default:
                        navigate("/");
                }

        } catch (error: any) {

            console.error("Login error:", error);

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Login failed. Please check your email and password."
                );
            }

        } finally {

            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* =====================================================
                LEFT SIDE - BRANDING
            ====================================================== */}

            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 relative overflow-hidden">

                {/* Decorative circles */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full" />
                <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-white/10 rounded-full" />

                <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-blue-600">
                                +
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold">
                                Smart Pharmacy
                            </h1>

                            <p className="text-sm text-blue-100">
                                Management System
                            </p>
                        </div>
                    </div>


                    {/* Main message */}
                    <div className="max-w-lg">

                        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-green-300" />

                            <span className="text-sm">
                                Pharmacy Management Platform
                            </span>
                        </div>

                        <h2 className="text-5xl font-bold leading-tight">
                            Manage your pharmacy
                            <span className="block text-cyan-100">
                                smarter & faster.
                            </span>
                        </h2>

                        <p className="mt-6 text-blue-100 text-lg leading-relaxed">
                            Manage medicines, inventory, suppliers, orders
                            and customers from one powerful platform.
                        </p>


                        {/* Features */}
                        <div className="mt-8 grid grid-cols-2 gap-4">

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <span className="text-sm">
                                    Inventory Management
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <span className="text-sm">
                                    Order Management
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <span className="text-sm">
                                    Stock Monitoring
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>

                                <span className="text-sm">
                                    Secure Access
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* Footer */}
                    <p className="text-sm text-blue-100">
                        © 2026 Smart Pharmacy Management System
                    </p>

                </div>
            </div>


            {/* =====================================================
                RIGHT SIDE - LOGIN FORM
            ====================================================== */}

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">

                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

                        <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                +
                            </span>
                        </div>

                        <div>
                            <h1 className="font-bold text-lg text-slate-900">
                                Smart Pharmacy
                            </h1>

                            <p className="text-xs text-slate-500">
                                Management System
                            </p>
                        </div>

                    </div>


                    {/* Heading */}
                    <div className="mb-8">

                        <p className="text-sm font-semibold text-blue-600 mb-2">
                            WELCOME BACK
                        </p>

                        <h2 className="text-3xl font-bold text-slate-900">
                            Sign in to your account
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Enter your credentials to continue.
                        </p>

                    </div>


                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    @
                                </span>

                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                            </div>

                        </div>


                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label className="text-sm font-medium text-slate-700">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <div className="relative">

                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full px-4 pr-20 py-3.5 border border-slate-200 rounded-xl bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-800"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Remember */}
                        <div className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />

                            <label
                                htmlFor="remember"
                                className="text-sm text-slate-600"
                            >
                                Remember me
                            </label>

                        </div>
                       
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* Login */}
                      
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>



                    </form>


                    {/* Register */}
                    <p className="text-center text-sm text-slate-500 mt-8">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create account
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

