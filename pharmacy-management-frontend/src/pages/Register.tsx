import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {

    const [showPassword, setShowPassword] = useState(false);


    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");

        if (!fullName || !email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        try {

            setLoading(true);

            await registerUser({
                fullName,
                email,
                password,
            });

            navigate("/login");

        } catch (error: any) {

            console.error(
                "Registration error:",
                error
            );

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Registration failed. Please try again."
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

                    {/* Main content */}
                    <div className="max-w-xl">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-md anim-float">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                            <span className="text-sm font-medium tracking-wide text-emerald-100 uppercase">
                                Join our platform
                            </span>
                        </div>
                        
                        <h2 className="text-5xl lg:text-6xl font-bold leading-tight drop-shadow-xl text-white">
                            Your pharmacy,
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 mt-2">
                                connected.
                            </span>
                        </h2>
                        
                        <p className="mt-6 text-emerald-100/70 text-lg leading-relaxed font-light mb-10">
                            Create your account and access a modern pharmacy management experience designed for growth and efficiency.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white tracking-wide">Easy management</p>
                                    <p className="text-sm text-emerald-200/60 font-light mt-1">Manage medicines and orders easily.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner backdrop-blur-sm">
                                    <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-white tracking-wide">Secure platform</p>
                                    <p className="text-sm text-emerald-200/60 font-light mt-1">Your account is protected with JWT.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-sm text-emerald-300/50 font-medium">
                        © 2026 Smart Pharmacy Inc. All rights reserved.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE - REGISTER FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-900">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10 anim-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center justify-center gap-4 mb-10">
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
                            Create your account
                        </h2>
                        <p className="text-slate-400 font-medium">
                            Fill in your details to get started.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-12 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
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
                                    placeholder="Create a password"
                                    className="w-full pl-12 pr-14 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm password
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-700/50 rounded-xl bg-slate-800/50 text-white placeholder-slate-500 outline-none transition-all focus:border-teal-500 focus:bg-slate-800 focus:ring-4 focus:ring-teal-500/10 backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 pt-2">
                            <label className="relative flex cursor-pointer items-center rounded-full mt-0.5" htmlFor="terms">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800/50 transition-all checked:border-teal-500 checked:bg-teal-500 hover:border-teal-400"
                                />
                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </label>
                            <label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed cursor-pointer select-none">
                                I agree to the{" "}
                                <span className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                                    Privacy Policy
                                </span>
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

                        {/* Register button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-press w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/25 tracking-wide flex justify-center items-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : "Create Account"}
                        </button>
                    </form>

                    {/* Login */}
                    <p className="text-center text-sm text-slate-400 mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

