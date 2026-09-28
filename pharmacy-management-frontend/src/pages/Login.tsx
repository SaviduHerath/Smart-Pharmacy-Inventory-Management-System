import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

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

            // Backend login API
            const response = await loginUser({
                email,
                password,
            });

            const user = {
                    id: response.userId,
                    fullName: response.fullName,
                    email: response.email,
                    role: response.role,
                };

            // Save authentication state
            login(
                response.token,
                user
            );


            // Role-based redirect
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
                    setError("Invalid user role.");
            }

        } catch (error: any) {

            console.error("Login error:", error);

            if (typeof error.response?.data === "string") {
                setError(error.response.data);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
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
        <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans selection:bg-teal-500/30">
            {/* LEFT SIDE - BRANDING */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald-950">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity hover:opacity-50 transition-opacity duration-700 ease-in-out" 
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                />
                
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 to-transparent" />

                <div className="relative z-10 flex flex-col justify-between w-full p-12 lg:p-16 text-white anim-page">
                    {/* Logo */}
                    <div className="flex items-center gap-4 hover-lift w-max">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                                Smart Pharmacy
                            </h1>
                            <p className="text-sm font-medium text-emerald-200/80 uppercase tracking-widest">
                                Management System
                            </p>
                        </div>
                    </div>

                    {/* Main message */}
                    <div className="max-w-xl">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-md anim-float">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                            <span className="text-sm font-medium tracking-wide text-emerald-100">
                                Enterprise Platform
                            </span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-xl text-white">
                            Your pharmacy,
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 mt-2">
                                elevated.
                            </span>
                        </h2>
                        <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed font-light">
                            Experience the next generation of healthcare management. Streamline operations, empower your staff, and deliver exceptional patient care.
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-emerald-300/50 font-medium">
                        © 2026 Smart Pharmacy Inc. All rights reserved.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-900">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10 anim-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center justify-center gap-4 mb-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h1 className="font-bold text-2xl text-white tracking-tight">Smart Pharmacy</h1>
                            <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest mt-1">Management System</p>
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Welcome back
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Enter your credentials to access your portal.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </span>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">
                                    Password
                                </label>
                                <button type="button" className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-14 py-3.5 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember */}
                        <div className="flex items-center gap-3">
                            <label className="relative flex cursor-pointer items-center rounded-full" htmlFor="remember">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800/50 transition-all checked:border-teal-500 checked:bg-teal-500 hover:border-teal-400"
                                />
                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </label>
                            <label htmlFor="remember" className="text-sm text-slate-300 cursor-pointer select-none">
                                Remember for 30 days
                            </label>
                        </div>
                       
                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-start gap-3 anim-toast">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Login */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-press w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/25 tracking-wide flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </>
                            ) : "Sign In"}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="text-center text-sm text-slate-400 mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

